
import argparse
import os
import sys
import sqlite3
import threading
import pickle
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

import cv2
import numpy as np
import requests
from numpy.linalg import norm
from deepface import DeepFace

# ---------- Config / Helpers ----------

DEFAULT_WORKERS = 8
DEFAULT_THRESHOLD = 0.38  # cosine similarity threshold for ArcFace

def init_db(db_path):
    conn = sqlite3.connect(db_path, check_same_thread=False)
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS embeddings (
            url TEXT PRIMARY KEY,
            filename TEXT,
            embedding BLOB,
            created_at REAL
        )
    ''')
    conn.commit()
    return conn

def save_embedding(conn, url, filename, emb):
    cur = conn.cursor()
    blob = pickle.dumps(emb, protocol=pickle.HIGHEST_PROTOCOL)
    cur.execute('REPLACE INTO embeddings (url, filename, embedding, created_at) VALUES (?, ?, ?, ?)',
                (url, filename, blob, time.time()))
    conn.commit()

def load_embedding(conn, url):
    cur = conn.cursor()
    cur.execute('SELECT embedding FROM embeddings WHERE url=?', (url,))
    row = cur.fetchone()
    if row:
        return pickle.loads(row[0])
    return None

def clear_cache(conn):
    cur = conn.cursor()
    cur.execute('DELETE FROM embeddings')
    conn.commit()

def to_rgb(img):
    return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

def download_image(url, timeout=6):
    try:
        r = requests.get(url, timeout=timeout)
        arr = np.frombuffer(r.content, np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        return img
    except Exception:
        return None

def extract_face_once(img_rgb):
    """
    Use DeepFace.extract_faces to get the cropped face region (first face).
    Return None if no face detected.
    """
    try:
        faces = DeepFace.extract_faces(img_path=img_rgb, detector_backend="retinaface", enforce_detection=True)
        if faces and len(faces) > 0:
            # face returned as numpy array (BGR)
            face = faces[0]["face"]
            return face
    except Exception:
        return None
    return None

def get_embedding_from_face(face_rgb):
    """
    Get embedding using DeepFace.represent with detector_backend='skip'
    Expects face array (RGB or BGR) — DeepFace will handle it if array passed.
    """
    try:
        reps = DeepFace.represent(img_path=np.array(face_rgb), model_name="ArcFace", detector_backend="skip")
        if isinstance(reps, list) and len(reps) > 0:
            emb = np.array(reps[0]["embedding"], dtype=np.float32)
            return emb
    except Exception:
        return None
    return None

def cosine_similarity(a, b):
    return float(np.dot(a, b) / (norm(a) * norm(b)))

# ---------- Worker for preparing embeddings ----------

def prepare_embedding_for_url(url, conn, lock, verbose=False):
    """
    Returns (url, filename, embedding or None)
    If embedding present in DB, returns it.
    Otherwise downloads, extracts face, computes embedding, stores in DB and returns.
    """
    # Check cache first
    emb = load_embedding(conn, url)
    if emb is not None:
        if verbose:
            print(f"[cache] loaded embedding for {url}")
        return (url, os.path.basename(url), emb)

    # Not cached -> download + extract + represent
    img = download_image(url)
    if img is None:
        if verbose:
            print(f"[err] could not download {url}")
        return (url, os.path.basename(url), None)

    rgb = to_rgb(img)
    face = extract_face_once(rgb)
    if face is None:
        if verbose:
            print(f"[err] no face found in {url}")
        return (url, os.path.basename(url), None)

    emb = get_embedding_from_face(face)
    if emb is None:
        if verbose:
            print(f"[err] could not represent {url}")
        return (url, os.path.basename(url), None)

    # Save to DB (thread-safe)
    with lock:
        save_embedding(conn, url, os.path.basename(url), emb)
        if verbose:
            print(f"[save] cached embedding for {url}")

    return (url, os.path.basename(url), emb)

# ---------- Main matching flow ----------

def main(args):
    # Optional GPU hint: if user asked to use GPU, set environment variables.
    if args.use_gpu:
        # Attempt to let TF allocate memory dynamically on GPU
        os.environ["TF_FORCE_GPU_ALLOW_GROWTH"] = "true"

    # Init DB
    conn = init_db(args.cache)
    db_lock = threading.Lock()

    # Load webcam image and compute embedding (do face detection once)
    webcam_img = cv2.imread(args.webcam)
    if webcam_img is None:
        print("Error: Webcam image not found or unreadable.")
        sys.exit(2)

    webcam_rgb = to_rgb(webcam_img)
    webcam_face = extract_face_once(webcam_rgb)
    if webcam_face is None:
        print("Error: No face detected in webcam image.")
        sys.exit(3)

    webcam_emb = get_embedding_from_face(webcam_face)
    if webcam_emb is None:
        print("Error: Could not compute embedding for webcam face.")
        sys.exit(4)

    urls = [u.strip() for u in args.urls.split(",") if u.strip()]
    if len(urls) == 0:
        print("Error: No candidate URLs provided.")
        sys.exit(5)

    # Prepare embeddings for candidates in parallel (load cached or compute)
    embeddings_map = {}  # url -> (filename, emb)
    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        futures = {ex.submit(prepare_embedding_for_url, url, conn, db_lock, args.verbose): url for url in urls}
        for future in as_completed(futures):
            url = futures[future]
            try:
                _url, filename, emb = future.result()
                if emb is not None:
                    embeddings_map[_url] = (filename, emb)
            except Exception as e:
                if args.verbose:
                    print(f"[err] worker exception for {url}: {e}")

    # Now match cached embeddings quickly (single-threaded, cheap)
    best_match = None
    best_score = -1.0
    for url, (filename, emb) in embeddings_map.items():
        sim = cosine_similarity(webcam_emb, emb)
        if args.verbose:
            print(f"[score] {filename}: {sim:.4f}")
        if sim > best_score:
            best_score = sim
            best_match = (url, filename, sim)

    # Check threshold
    if best_match and best_score >= args.threshold:
        print(best_match[1])  # print filename only (like original)
    else:
        print("NO_MATCH")

    conn.close()

# ---------- CLI ----------

if __name__ == "__main__":
    p = argparse.ArgumentParser(description="Fast face matcher with embedding cache")
    p.add_argument("--webcam", required=True, help="path to webcam image (local file)")
    p.add_argument("--urls", required=True, help="comma-separated Cloudinary (or web) image URLs")
    p.add_argument("--cache", default="embeddings.db", help="sqlite path to cache embeddings")
    p.add_argument("--workers", type=int, default=DEFAULT_WORKERS, help="parallel workers for downloads/embeddings")
    p.add_argument("--threshold", type=float, default=DEFAULT_THRESHOLD, help="cosine similarity threshold")
    p.add_argument("--use-gpu", action="store_true", help="hint to enable GPU usage if available")
    p.add_argument("--verbose", action="store_true", help="print debug info")
    p.add_argument("--clear-cache", action="store_true", help="clear the embedding cache before running")
    args = p.parse_args()

    if args.clear_cache and os.path.exists(args.cache):
        conn_tmp = init_db(args.cache)
        clear_cache(conn_tmp)
        conn_tmp.close()
        if args.verbose:
            print("[cache] cleared")

    main(args)
