from io import BytesIO

from PIL import Image, UnidentifiedImageError
import json
import os
import numpy as np

try:
    import tensorflow as tf
except ImportError:
    tf = None


ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_IMAGE_SIZE = 5 * 1024 * 1024
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
MODEL_PATH = os.getenv("MODEL_PATH", os.path.join(BASE_DIR, "model", "crop_health_model.keras"))
CLASS_NAMES_PATH = os.getenv("CLASS_NAMES_PATH", os.path.join(BASE_DIR, "model", "class_names.txt"))
_model = None
_class_names = None


def _load_model():
    global _model, _class_names
    if tf is None or not os.path.isfile(MODEL_PATH) or not os.path.isfile(CLASS_NAMES_PATH):
        return None, None
    if _model is None:
        _model = tf.keras.models.load_model(MODEL_PATH)
        with open(CLASS_NAMES_PATH, encoding="utf-8") as class_file:
            _class_names = [line.strip() for line in class_file if line.strip()]
    return _model, _class_names


def predict_image(image_bytes: bytes, content_type: str | None) -> dict:
    if content_type not in ALLOWED_CONTENT_TYPES:
        raise ValueError("Only JPEG, PNG, and WebP images are supported.")
    if not image_bytes or len(image_bytes) > MAX_IMAGE_SIZE:
        raise ValueError("Image must be between 1 byte and 5MB.")

    try:
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
    except UnidentifiedImageError as error:
        raise ValueError("Uploaded file is not a valid image.") from error

    model, class_names = _load_model()
    if model is None:
        return {"status": "model_not_configured"}

    input_image = image.resize((160, 160))
    image_array = np.asarray(input_image, dtype=np.float32)
    image_array = tf.keras.applications.mobilenet_v2.preprocess_input(image_array)
    prediction = model.predict(np.expand_dims(image_array, axis=0), verbose=0)[0]
    predicted_index = int(np.argmax(prediction))
    predicted_label = class_names[predicted_index]
    confidence = float(prediction[predicted_index] * 100)
    crop, _, disease = predicted_label.partition("___")
    disease = disease or predicted_label
    severity = "High" if confidence >= 85 else "Moderate" if confidence >= 60 else "Low"

    return {
        "status": "ok",
        "image_size": {"width": image.width, "height": image.height},
        "crop": crop,
        "disease": disease,
        "confidence": round(confidence, 2),
        "severity": severity,
        "recommendation": "Inspect affected leaves and follow local agricultural guidance.",
    }
