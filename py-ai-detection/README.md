# Crop Health AI Detection

Standalone Python service for crop-image validation and disease prediction.

The training script in `app.py` expects a local PlantVillage-style image folder. Add one folder per class under `data/PlantVillage/` before training.

## Structure

- `app.py`: model training and camera evaluation script
- `src/api/routes.py`: HTTP endpoints
- `src/services/prediction_service.py`: validation, preprocessing, and prediction boundary
- `model/`: trained model files, kept out of source control unless explicitly required
- `data/PlantVillage/`: training images grouped by class folder
- `tests/`: service tests

## Run the Python API scaffold

```powershell
cd py-ai-detection
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn src.api.app:app --reload --port 8000
```

Endpoints:

- `GET http://localhost:8000/health`
- `POST http://localhost:8000/api/predict`

The API scaffold currently validates images and returns `model_not_configured` until a trained model is added to the prediction service.

## Dataset layout

```text
data/PlantVillage/
├── Tomato___Early_blight/
│   ├── image-001.jpg
│   └── image-002.jpg
└── Tomato___healthy/
	└── image-003.jpg
```

You can point to another dataset location with `PLANTVILLAGE_DIR`.

## Train the model

```powershell
python app.py
```

The trained model and class names are written to `model/`.

## Detection flow

Start the Python prediction service separately:

```powershell
uvicorn src.api.app:app --reload --port 8000
```

The Node backend forwards authenticated image uploads to this service at `AI_SERVICE_URL`, then saves the response to the authenticated user's detection history.

## Test

```powershell
pytest
```
