import tensorflow as tf
import numpy as np
import cv2
import mediapipe as mp
from pathlib import Path

# --- Model Loading (Singleton Pattern) ---
class SkinModel:
    model: tf.keras.Model = None
    mp_segmentation = None

    def load_model(self):
        if self.model is None:
            print("Loading ML model...")
            model_path = Path("ml_model/skin_model_v2_balanced.h5")
            self.model = tf.keras.models.load_model(model_path)
            self.mp_segmentation = mp.solutions.selfie_segmentation.SelfieSegmentation(model_selection=0)
            print("ML model loaded successfully.")

    def preprocess_image(self, image_bytes: bytes) -> np.ndarray:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = self.mp_segmentation.process(rgb_img)
        mask = results.segmentation_mask > 0.7
        mask_uint8 = mask.astype('uint8') * 255
        skin_only = cv2.bitwise_and(img, img, mask=mask_uint8)

        skin_rgb = cv2.cvtColor(skin_only, cv2.COLOR_BGR2RGB)
        img_resized = tf.image.resize(skin_rgb, [224, 224])
        img_array = tf.keras.preprocessing.image.img_to_array(img_resized)
        img_array = img_array / 255.0
        return np.expand_dims(img_array, axis=0)

    def predict(self, image_bytes: bytes) -> dict:
        processed_batch = self.preprocess_image(image_bytes)
        prediction_proba = self.model.predict(processed_batch)[0][0]
        
        # Assuming class_indices were {'normal': 0, 'tanned': 1}
        if prediction_proba > 0.5:
            return {"prediction": "Tanned", "confidence": float(prediction_proba)}
        else:
            return {"prediction": "Normal", "confidence": float(1 - prediction_proba)}

skin_model = SkinModel()