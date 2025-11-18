import sys
from deepface import DeepFace
import requests
import cv2
import numpy as np
import os
from io import BytesIO

webcam_path = sys.argv[1]
cloudinary_urls = sys.argv[2].split(",")

def load_image_from_url(url):
    response = requests.get(url)
    img_array = np.frombuffer(response.content, np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    return img

try:
    webcam_img = cv2.imread(webcam_path)

    for url in cloudinary_urls:
        db_img = load_image_from_url(url)

        # Compare using DeepFace
        result = DeepFace.verify(webcam_img, db_img, model_name="VGG-Face", enforce_detection=False)

        if result["verified"]:
            print(os.path.basename(url))   # Return only filename
            exit()

    print("NO_MATCH")

except Exception as e:
    print("Error:", e)
