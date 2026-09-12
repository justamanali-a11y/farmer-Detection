from fastapi import APIRouter, File, UploadFile

from src.services.prediction_service import predict_image

router = APIRouter(prefix="/api", tags=["detection"])


@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    return predict_image(image_bytes, file.content_type)
