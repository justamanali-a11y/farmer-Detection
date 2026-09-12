from io import BytesIO

from PIL import Image


def load_rgb_image(image_bytes: bytes) -> Image.Image:
    return Image.open(BytesIO(image_bytes)).convert("RGB")


def prepare_for_model(image: Image.Image, size: tuple[int, int] = (224, 224)):
    resized = image.resize(size)
    return resized
