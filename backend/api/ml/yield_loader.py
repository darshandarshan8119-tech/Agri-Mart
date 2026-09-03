import os
from django.conf import settings
import joblib

crop_multipliers = {
    'wheat':     { 'basePerAcre': 3.8,  'mspPerQtl': 2275, 'name': 'Wheat' },
    'rice':      { 'basePerAcre': 4.9,  'mspPerQtl': 2200, 'name': 'Rice' },
    'cotton':    { 'basePerAcre': 1.4,  'mspPerQtl': 6620, 'name': 'Cotton' },
    'sugarcane': { 'basePerAcre': 35.0, 'mspPerQtl': 315,  'name': 'Sugarcane' },
    'tomato':    { 'basePerAcre': 14.0, 'mspPerQtl': 1600, 'name': 'Tomato' },
    'soybean':   { 'basePerAcre': 1.8,  'mspPerQtl': 4600, 'name': 'Soybean' },
}

class YieldModelHandler:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._load_model()
        return cls._instance

    def _load_model(self):
        self.model_path = getattr(settings, 'ML_MODELS_DIR', None)
        self.yield_model = None

        if self.model_path and os.path.exists(self.model_path):
            model_file = os.path.join(self.model_path, 'yield_model.pkl')
            if os.path.exists(model_file):
                try:
                    self.yield_model = joblib.load(model_file)
                    print("[ML Loader] Successfully loaded yield_model.pkl!")
                except Exception as e:
                    print(f"[ML Loader] Failed to load yield_model.pkl: {e}")

    def predict(self, crop, acres, irrigation, fertilizer):
        crop_data = crop_multipliers.get(crop, crop_multipliers['rice'])
        
        irrig_map = {'drip': 1.2, 'sprinkler': 1.1, 'canal': 1.0, 'rainfed': 0.82}
        fert_map  = {'balanced': 1.12, 'chemical': 1.0, 'pure_organic': 0.95}

        irrig_mult = irrig_map.get(irrigation, 1.0)
        fert_mult  = fert_map.get(fertilizer, 1.0)

        yield_per_acre = crop_data['basePerAcre'] * irrig_mult * fert_mult
        total_tonnes   = round(yield_per_acre * float(acres), 1)
        total_quintals = total_tonnes * 10
        gross_revenue  = int(total_quintals * crop_data['mspPerQtl'])

        return {
            "totalTonnes": str(total_tonnes),
            "yieldPerAcre": str(round(yield_per_acre, 2)),
            "grossRevenue": f"{gross_revenue:,}",
            "mspPerQtl": crop_data['mspPerQtl'],
            "cropName": crop_data['name']
        }

yield_handler = YieldModelHandler()
