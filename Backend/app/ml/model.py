import tensorflow as tf
import numpy as np
import cv2
import mediapipe as mp
from pathlib import Path
import requests  # Library for making HTTP requests
import os

# --- The public URL to your model file from the GitHub Release ---
MODEL_URL = "https://github.com/t-emit/ai-uv-tracker-app/releases/download/V1.0.0/skin_model_v2_balanced.h5"
MODEL_DIR = Path("ml_model")
MODEL_PATH = MODEL_DIR / "skin_model_v2_balanced.h5"

class SkinModel:
    model: tf.keras.Model = None
    mp_segmentation = None

    def download_model_if_needed(self):
        """Checks if the model file exists, and downloads it if it doesn't."""
        # Create the directory if it doesn't exist
        MODEL_DIR.mkdir(exist_ok=True)
        
        if not MODEL_PATH.exists():
            print(f"Model not found at {MODEL_PATH}. Downloading from {MODEL_URL}...")
            try:
                response = requests.get(MODEL_URL, stream=True)
                response.raise_for_status()  # Raise an exception for bad status codes
                
                with open(MODEL_PATH, "wb") as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                
                print("Model downloaded successfully.")
            except requests.exceptions.RequestException as e:
                print(f"Error downloading model: {e}")
                raise RuntimeError(f"Failed to download model from {MODEL_URL}")
        else:
            print("Model already exists locally.")

    def load_model(self):
        if self.model is None:
            self.download_model_if_needed()
            
            print("Loading ML model...")
            self.model = tf.keras.models.load_model(MODEL_PATH)
            self.mp_segmentation = mp.solutions.selfie_segmentation.SelfieSegmentation(model_selection=0)
            print("ML model loaded successfully.")

    # ... (the preprocess_image and predict methods remain exactly the same) ...
    def preprocess_image(self, image_bytes: bytes) -> np.ndarray:
        # ... no changes here ...
    
    def predict(self, image_bytes: bytes) -> dict:
        # ... no changes here ...


skin_model = SkinModel()