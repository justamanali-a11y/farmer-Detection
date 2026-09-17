import { PredictionResult, SampleLeaf } from '../types';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(/\/$/, '');

const mapBackendPrediction = (data: any, imageUrl: string): PredictionResult => ({
  id: 'pred-' + Date.now(),
  source: data.source === 'fallback' ? 'fallback' : 'gemini',
  isCropImage: data.isCropImage !== false,
  cropName: data.crop || data.cropName || 'Detected Crop',
  diseaseName: data.disease || data.diseaseName || 'Crop Health Check',
  scientificName: data.scientificName || 'Crop Pathology',
  isHealthy: data.isHealthy === true || (typeof data.disease === 'string' && /healthy|normal/i.test(data.disease)),
  confidence: Number(data.confidence || 90),
  severity: data.severity || 'Moderate',
  detectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  imageUrl,
  rejectionReason: data.rejectionReason,
  symptoms: Array.isArray(data.symptoms) && data.symptoms.length > 0
    ? data.symptoms
    : [data.recommendation || 'Crop health is being assessed.'],
  treatment: {
    organic: Array.isArray(data.treatment?.organic) ? data.treatment.organic : ['Follow agronomic best practices.'],
    chemical: Array.isArray(data.treatment?.chemical) ? data.treatment.chemical : ['Use chemical treatment only when agronomic guidance requires it.'],
    prevention: Array.isArray(data.treatment?.prevention) ? data.treatment.prevention : ['Monitor crop regularly and maintain field sanitation.'],
  },
  cropHealthScore: Number(data.cropHealthScore ?? 75),
  spreadRisk: data.spreadRisk || 'Medium',
});

export async function detectCropDisease(
  imageSource: string | File,
  _sampleRef?: SampleLeaf | null,
  _isExplicitNonCropTest?: boolean
): Promise<PredictionResult> {
  const imageUrl = typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource);

  try {
    const formData = new FormData();

    if (typeof imageSource === 'string') {
      const response = await fetch(imageSource);
      const blob = await response.blob();
      formData.append('image', blob, 'crop-leaf.jpg');
    } else {
      formData.append('image', imageSource, imageSource.name || 'crop-leaf.jpg');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(`${API_URL}/api/detection/predict`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.message || 'Detection failed on the backend.');
    }

    const data = await response.json();
    return mapBackendPrediction(data, imageUrl);
  } catch (error: any) {
    const message = error?.message || 'Unable to connect to the crop detection backend.';
    throw new Error(message);
  }
}
