from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from src.api.routes import router

app = FastAPI(
    title="Crop Health AI Detection Service",
    version="0.1.0",
)

app.include_router(router)


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, error: ValueError):
    return JSONResponse(status_code=400, content={"message": str(error)})


@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": False}
