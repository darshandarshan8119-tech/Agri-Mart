import os
import warnings
from django.conf import settings
import joblib
import numpy as np

# ─────────────────────────────────────────────────────────────────────────────
# Crop metadata: emoji, typical yield range, short agronomic description
# ─────────────────────────────────────────────────────────────────────────────
CROP_META = {
    "rice":        {"emoji": "🌾", "yield": "4.8 – 5.5 T/Acre", "desc": "Thrives in high-rainfall, waterlogged loamy soils with adequate nitrogen."},
    "maize":       {"emoji": "🌽", "yield": "3.5 – 4.5 T/Acre", "desc": "Performs well in well-drained fertile soils with moderate rainfall."},
    "chickpea":    {"emoji": "🫘", "yield": "0.8 – 1.2 T/Acre", "desc": "Leguminous crop; fixes nitrogen and suits dry, cool Rabi seasons."},
    "kidneybeans": {"emoji": "🫘", "yield": "0.6 – 1.0 T/Acre", "desc": "Grows in well-drained loamy soil with moderate humidity."},
    "pigeonpeas":  {"emoji": "🌱", "yield": "0.7 – 1.0 T/Acre", "desc": "Drought-tolerant legume; ideal for mixed cropping systems."},
    "mothbeans":   {"emoji": "🌿", "yield": "0.4 – 0.7 T/Acre", "desc": "Highly drought-resistant; suited for arid and semi-arid regions."},
    "mungbean":    {"emoji": "🫘", "yield": "0.5 – 0.8 T/Acre", "desc": "Short-duration crop that improves soil health via nitrogen fixation."},
    "blackgram":   {"emoji": "🫘", "yield": "0.5 – 0.8 T/Acre", "desc": "Warm-weather legume grown in sandy-loam to clay-loam soils."},
    "lentil":      {"emoji": "🌿", "yield": "0.5 – 0.9 T/Acre", "desc": "Cool-season pulse; grows well in dry climates with low rainfall."},
    "pomegranate": {"emoji": "🍎", "yield": "8 – 12 T/Acre",   "desc": "Prefers semi-arid climate with well-drained light soils."},
    "banana":      {"emoji": "🍌", "yield": "20 – 35 T/Acre",  "desc": "Tropical fruit requiring high humidity and fertile well-drained soil."},
    "mango":       {"emoji": "🥭", "yield": "5 – 8 T/Acre",    "desc": "Thrives in tropical and sub-tropical climates with a dry flowering season."},
    "grapes":      {"emoji": "🍇", "yield": "6 – 12 T/Acre",   "desc": "Best in well-drained sandy-loam soils with warm, dry summers."},
    "watermelon":  {"emoji": "🍉", "yield": "15 – 25 T/Acre",  "desc": "Requires light sandy soil with good drainage and a long warm season."},
    "muskmelon":   {"emoji": "🍈", "yield": "8 – 15 T/Acre",   "desc": "Grows in warm, dry weather with sandy-loam soil."},
    "apple":       {"emoji": "🍏", "yield": "10 – 20 T/Acre",  "desc": "Needs cool winters and well-drained loamy soil in hilly terrains."},
    "orange":      {"emoji": "🍊", "yield": "8 – 15 T/Acre",   "desc": "Subtropical fruit requiring mild winters and well-drained fertile soil."},
    "papaya":      {"emoji": "🍐", "yield": "30 – 45 T/Acre",  "desc": "Fast-growing tropical fruit; prefers rich, well-drained sandy-loam."},
    "coconut":     {"emoji": "🥥", "yield": "3 – 5 T/Acre",    "desc": "Tropical palm suited to coastal sandy soils with high humidity."},
    "cotton":      {"emoji": "☁️", "yield": "1.2 – 1.8 T/Acre","desc": "Requires warm temperature, deep black soil, and moderate rainfall."},
    "jute":        {"emoji": "🌿", "yield": "2 – 3 T/Acre",    "desc": "Thrives in high-humidity, flood-plain alluvial soils during Kharif."},
    "coffee":      {"emoji": "☕", "yield": "0.5 – 1.0 T/Acre","desc": "Shade-loving crop; needs well-drained laterite soils in hilly areas."},
}

def _get_meta(crop_name: str) -> dict:
    key = crop_name.lower().replace(" ", "").replace("-", "")
    return CROP_META.get(key, {"emoji": "🌱", "yield": "Varies", "desc": "Suitable for your soil and climate profile."})


class RecommendationModelHandler:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._load_model()
        return cls._instance

    def _load_model(self):
        self.rf_model = None
        self.all_classes = None  # list of string crop names from the model

        base_ml_dir = getattr(settings, 'ML_MODELS_DIR', None)
        if not base_ml_dir:
            print("[ML Loader] ML_MODELS_DIR not set in settings.py")
            return

        # Folder name has the original typo: "recommandation"
        crop_dir = os.path.join(str(base_ml_dir), 'crop_recommandation')
        model_file = os.path.join(crop_dir, 'random_forest_crop.pkl')

        if not os.path.exists(crop_dir):
            print("[ML Loader] Crop recommendation directory not found: {}".format(crop_dir))
            return

        if not os.path.exists(model_file):
            print("[ML Loader] Model file not found: {}".format(model_file))
            return

        try:
            # Suppress sklearn version mismatch warnings (model still works)
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                self.rf_model = joblib.load(model_file)

            # The model was trained on string labels directly (not encoded integers)
            # so classes_ already contains the string crop names
            self.all_classes = list(self.rf_model.classes_)
            print("[ML Loader] Loaded random_forest_crop.pkl — {} crops".format(len(self.all_classes)))
        except Exception as e:
            print("[ML Loader] Failed to load random_forest_crop.pkl: {}".format(e))

    def predict(self, N, P, K, ph, rainfall, temp, humidity):
        """
        Return top-3 crop recommendations.

        Feature order expected by the model (matches training CSV columns):
            N, P, K, temperature, humidity, ph, rainfall
        """
        if self.rf_model is not None:
            try:
                # Suppress feature-name warning (we pass a raw array, not DataFrame)
                with warnings.catch_warnings():
                    warnings.simplefilter("ignore")
                    features = np.array([[N, P, K, temp, humidity, ph, rainfall]], dtype=float)
                    top_crop_name = str(self.rf_model.predict(features)[0])
                    probs = self.rf_model.predict_proba(features)[0]

                # Pair each class with its probability and sort descending
                class_probs = sorted(
                    zip(self.all_classes, probs),
                    key=lambda x: x[1],
                    reverse=True
                )
                top3 = class_probs[:3]

                def build_entry(name, prob, include_yield=False):
                    meta = _get_meta(name)
                    entry = {
                        "emoji": meta["emoji"],
                        "title": name.capitalize(),
                        "match": "{}%".format(round(float(prob) * 100, 1)),
                        "desc":  meta["desc"],
                    }
                    if include_yield:
                        entry["yield"] = meta["yield"]
                    return entry

                return {
                    "topCrop":    build_entry(*top3[0], include_yield=True),
                    "secondCrop": build_entry(*top3[1]) if len(top3) > 1 else None,
                    "thirdCrop":  build_entry(*top3[2]) if len(top3) > 2 else None,
                    "model_used": "RandomForest (trained on Crop_recommendation.csv)"
                }

            except Exception as e:
                print("[ML Loader] Prediction error: {}".format(e))
                import traceback
                traceback.print_exc()

        # ── Rule-based fallback if model failed to load ──────────────────────
        print("[ML Loader] Using rule-based fallback (model not loaded)")
        if rainfall > 160:
            return {
                "topCrop":    {"emoji": "🌾", "title": "Rice",   "match": "98.4%", "yield": "4.8 – 5.5 T/Acre", "desc": "High rainfall and nitrogen create prime conditions for rice."},
                "secondCrop": {"emoji": "🌽", "title": "Maize",  "match": "89.1%", "desc": "Strong secondary choice with moderate drought resilience."},
                "thirdCrop":  {"emoji": "🌿", "title": "Jute",   "match": "84.0%", "desc": "Ideal for flood-plain alluvial soils during Kharif season."},
                "model_used": "rule-based fallback"
            }
        elif N > 100:
            return {
                "topCrop":    {"emoji": "☁️", "title": "Cotton",    "match": "96.5%", "yield": "1.2 – 1.8 T/Acre", "desc": "High nitrogen with warm temperatures suits cotton perfectly."},
                "secondCrop": {"emoji": "🌾", "title": "Wheat",     "match": "91.2%", "desc": "Thrives in rich soil during Rabi cooler cycles."},
                "thirdCrop":  {"emoji": "🌻", "title": "Sunflower", "match": "86.4%", "desc": "Excellent deep-root nutrient extraction crop."},
                "model_used": "rule-based fallback"
            }
        else:
            return {
                "topCrop":    {"emoji": "🥔", "title": "Potato",   "match": "95.1%", "yield": "8.5 – 11 T/Acre", "desc": "Moderate pH and well-drained soil fosters tuber growth."},
                "secondCrop": {"emoji": "🍅", "title": "Tomato",   "match": "90.3%", "desc": "Strong commercial returns with balanced irrigation."},
                "thirdCrop":  {"emoji": "🥜", "title": "Groundnut","match": "87.5%", "desc": "High nitrogen-fixing capability for soil rejuvenation."},
                "model_used": "rule-based fallback"
            }


rec_handler = RecommendationModelHandler()
