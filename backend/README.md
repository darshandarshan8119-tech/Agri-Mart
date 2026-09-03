# 🌾 Agri-MART Django Backend Guide for Beginners

Welcome to the backend documentation for **Agri-MART**! This guide is created to help you understand how Django works, how the project is structured, and how HTTP requests flow through Django into Machine Learning models to return responses to the React frontend.

---

## 📚 Table of Contents
1. [Core Django Concepts Explained](#1-core-django-concepts-explained)
2. [Folder & Directory Structure](#2-folder--directory-structure)
3. [The Complete Request-Response Workflow](#3-the-complete-request-response-workflow)
4. [How ML Models Are Loaded (Singleton Pattern)](#4-how-ml-models-are-loaded-singleton-pattern)
5. [API Endpoints & Payload Guide](#5-api-endpoints--payload-guide)
6. [How to Run & Debug the Django Backend](#6-how-to-run--debug-the-django-backend)

---

## 1. Core Django Concepts Explained

Django follows an **MVT (Model-View-Template)** architecture, but when building an **API Backend with Django REST Framework (DRF)**, it behaves as **Model-Serializer-View**:

| Django Component | What It Does | Analogy |
|---|---|---|
| **`manage.py`** | Command-line utility to run server, migrate DB, create apps | The control panel / ignition |
| **`settings.py`** | Project configuration (database, CORS, INSTALLED_APPS, Media) | The master configuration control room |
| **`urls.py`** | Routes incoming URL paths (`/api/ai/disease-scan/`) to Python functions | The traffic dispatcher / GPS router |
| **`views.py`** | Takes HTTP requests, runs logic/ML models, and returns HTTP responses | The kitchen chef preparing the order |
| **`models.py`** | Defines database tables using Python classes | The database architect |
| **`serializers.py`** | Converts Django objects into JSON (and vice-versa) | The translator between Python and Web JSON |

---

## 2. Folder & Directory Structure

```
backend/
├── agri_mart_backend/          # ⚙️ Master Project Configuration Folder
│   ├── __init__.py
│   ├── settings.py             # App configurations, CORS, ML paths
│   ├── urls.py                 # Root URL router (routes /api/ to api.urls)
│   ├── wsgi.py                 # Web Server Gateway Interface for deployment
│   └── asgi.py                 # Asynchronous Server Gateway Interface
│
├── api/                        # 🚀 Agri-MART API Application Folder
│   ├── ml/                     # 🧠 Machine Learning Model Loaders & Preprocessors
│   │   ├── disease_loader.py   # Handles CNN leaf image preprocessing & inference
│   │   ├── recommendation_loader.py # Handles NPK soil classifier prediction
│   │   └── yield_loader.py     # Handles crop harvest yield regressor
│   │
│   ├── views.py                # 📩 API logic for login, registration, disease, yield, market
│   ├── urls.py                 # 🗺️ Sub-routes (/auth/login/, /ai/disease-scan/, etc.)
│   ├── models.py               # 🗄️ Database schemas for users and scan logs
│   ├── apps.py                 # App configuration metadata
│   └── tests.py                # Unit tests
│
├── ml_models/                  # 💾 Drop your trained ML models here (.pth, .h5, .pkl, .onnx)
│   └── README.md               # Model format documentation & placement guide
│
├── media/                      # 🖼️ Uploaded crop foliage images stored here
├── venv/                       # 🐍 Isolated Python Virtual Environment
├── db.sqlite3                  # 📦 SQLite database file
├── manage.py                   # 🛠️ Django CLI tool
└── BACKEND_GUIDELINES.md       # 📖 Comprehensive guide
```

---

## 3. The Complete Request-Response Workflow

Here is exactly what happens when a user clicks **"Run AI Diagnostic Scan"** or **"Generate Crop Matches"** on the React frontend:

```
[User Action in React]
       │
       ▼
1. HTTP POST Request ──> http://localhost:8000/api/ai/disease-scan/
       │
       ▼
2. CORS Middleware Check (corsheaders in settings.py)
       │
       ▼
3. Root URL Resolver (agri_mart_backend/urls.py routes 'api/' -> api/urls.py)
       │
       ▼
4. App URL Resolver (api/urls.py routes 'ai/disease-scan/' -> views.disease_scan_view)
       │
       ▼
5. View Handler Execution (api/views.py invokes disease_handler.predict())
       │
       ▼
6. ML Model Inference (api/ml/disease_loader.py resizes image to 224x224 and feeds model)
       │
       ▼
7. Response Delivery (Returns JSON payload back to React frontend)
```

---

## 4. How ML Models Are Loaded (Singleton Pattern)

Loading large Machine Learning models directly inside a view function is **bad practice** because it would re-read the model file from hard disk on every HTTP request, slowing response times from 50ms to 5 seconds.

In `backend/api/ml/disease_loader.py`, `recommendation_loader.py`, and `yield_loader.py`, we use the **Python Singleton Pattern**:

```python
class DiseaseModelHandler:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._load_model() # Loaded ONLY ONCE into RAM!
        return cls._instance

disease_handler = DiseaseModelHandler()  # Instantiated once when Django boots up!
```

**Key Benefit**: When Django starts, the models load into CPU/GPU RAM **once**. When API requests come in, predictions happen instantly in milliseconds!

---

## 5. API Endpoints & Payload Guide

### 1. Auth: Sign In
- **URL**: `/api/auth/login/` (`POST`)
- **Payload**: `{ "email": "farmer.ramesh@agrimart.com", "password": "Harvest2026!" }`

### 2. Auth: Register
- **URL**: `/api/auth/register/` (`POST`)
- **Payload**: `{ "fullname": "Ramesh Patel", "email": "ramesh@agrimart.com", "phone": "+91 98765 43210", "role": "farmer" }`

### 3. AI: Leaf Disease Scan
- **URL**: `/api/ai/disease-scan/` (`POST` `multipart/form-data`)
- **Payload**: `image`: `(file)`

### 4. AI: Crop Recommendation
- **URL**: `/api/ai/crop-recommendation/` (`POST`)
- **Payload**: `{ "N": 90, "P": 42, "K": 43, "ph": 6.5, "rainfall": 202, "temp": 26.5, "humidity": 82 }`

### 5. AI: Yield Prediction
- **URL**: `/api/ai/yield-prediction/` (`POST`)
- **Payload**: `{ "crop": "rice", "acres": 5, "season": "kharif", "irrigation": "drip", "fertilizer": "balanced" }`

### 6. AI: Plant Growth Tracker
- **URL**: `/api/ai/growth-tracker/` (`GET`)

### 7. Market: Live Mandi Commodity Prices
- **URL**: `/api/market/prices/` (`GET`)

---

## 6. How to Run & Debug the Django Backend

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py runserver 8000
```
- Test endpoints in browser or Postman at `http://localhost:8000/api/market/prices/`.
