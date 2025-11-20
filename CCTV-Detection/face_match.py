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

DEFAULT_WORKERS = 8
DEFAULT_THRESHOLD = 0.38

# -------------------- DB --------------------
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

# -------------------- IMAGE HELPERS --------------------
def to_rgb(img):
    return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

def download_image(url):
    try:
        r = requests.get(url, timeout=6)
        arr = np.frombuffer(r.content, np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        return img
    except:
        return None

def extract_face(img_rgb):
    try:
        faces = DeepFace.extract_faces(img_path=img_rgb, detector_backend="retinaface", enforce_detection=True)
        if faces and len(faces) > 0:
            return faces[0]["face"]
    except:
        return None
    return None

def get_embedding(face):
    try:
        reps = DeepFace.represent(img_path=np.array(face), model_name="ArcFace", detector_backend="skip")
        if reps and len(reps) > 0:
            return np.array(reps[0]["embedding"], dtype=np.float32)
    except:
        return None
    return None

def cosine(a, b):
    return float(np.dot(a, b) / (norm(a) * norm(b)))

# -------------------- WORKER --------------------
def prepare(url, conn, lock):
    emb = load_embedding(conn, url)
    if emb is not None:
        return url, os.path.basename(url), emb

    img = download_image(url)
    if img is None:
        return url, None, None

    rgb = to_rgb(img)
    face = extract_face(rgb)
    if face is None:
        return url, None, None

    emb = get_embedding(face)
    if emb is None:
        return url, None, None

    with lock:
        save_embedding(conn, url, os.path.basename(url), emb)

    return url, os.path.basename(url), emb

# -------------------- MAIN --------------------
def main(args):
    conn = init_db(args.cache)
    lock = threading.Lock()

    img = cv2.imread(args.webcam)
    if img is None:
        print("NO_MATCH")
        sys.exit(1)

    rgb = to_rgb(img)
    face = extract_face(rgb)
    if face is None:
        print("NO_MATCH")
        sys.exit(1)

    webcam_emb = get_embedding(face)
    if webcam_emb is None:
        print("NO_MATCH")
        sys.exit(1)

    urls = [u.strip() for u in args.urls.split(",") if u.strip()]
    embeddings = {}

    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        futures = {ex.submit(prepare, u, conn, lock): u for u in urls}
        for f in as_completed(futures):
            url, fname, emb = f.result()
            if emb is not None:
                embeddings[url] = emb

    best_url = None
    best_score = -1

    for url, emb in embeddings.items():
        score = cosine(webcam_emb, emb)
        if score > best_score:
            best_score = score
            best_url = url

    if best_url and best_score >= args.threshold:
        print(best_url)    # RETURN FULL URL
    else:
        print("NO_MATCH")

    conn.close()

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--webcam", required=True)
    p.add_argument("--urls", required=True)
    p.add_argument("--cache", default="embeddings.db")
    p.add_argument("--workers", type=int, default=DEFAULT_WORKERS)
    p.add_argument("--threshold", type=float, default=DEFAULT_THRESHOLD)
    args = p.parse_args()
    main(args)
