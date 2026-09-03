# Agri-MART ML Models Directory

Place your trained machine learning and deep learning models in this directory so the Django backend can load them automatically.

## Supported File Formats & Recommendations

| Feature | Recommended Filename | Framework |
|---|---|---|
| **Leaf Disease Diagnosis** | `disease_model.pth` or `disease_model.h5` | PyTorch (`.pth`/`.pt`) or TensorFlow/Keras (`.h5`/`.keras`) |
| **Crop Recommendation** | `crop_recommendation.pkl` | scikit-learn (`.pkl` / `joblib`) |
| **Yield Prediction** | `yield_model.pkl` | scikit-learn / XGBoost (`.pkl` / `joblib`) |

---

## How Model Loading Works

The Django app initializes Singleton Loaders in `backend/api/ml/`:
- `disease_loader.py` - Preprocesses images (224x224 RGB tensor) and runs CNN inference.
- `recommendation_loader.py` - Takes `[N, P, K, temp, humidity, pH, rainfall]` vector and runs model `predict()` & `predict_proba()`.
- `yield_loader.py` - Takes farm parameters and predicts harvest output.

Models are loaded **once at Django startup into memory (RAM)** to guarantee sub-50ms API response times.
