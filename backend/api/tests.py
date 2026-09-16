import io
from PIL import Image
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from api.ml.disease_loader import disease_handler


class DiseaseDetectionAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_disease_model_is_loaded(self):
        """Verify that the user's .keras model is detected and loaded."""
        self.assertTrue(disease_handler.is_loaded)
        self.assertIsNotNone(disease_handler.model_path)
        self.assertIn('plant_disease_model (1).keras', disease_handler.model_path)

    def test_disease_scan_with_image(self):
        """Verify POST /api/ai/disease-scan/ runs inference on uploaded image file."""
        # Generate a synthetic 224x224 RGB image
        img = Image.new('RGB', (224, 224), color=(34, 139, 34))
        buf = io.BytesIO()
        img.save(buf, format='JPEG')
        buf.seek(0)
        uploaded = SimpleUploadedFile('test_leaf.jpg', buf.read(), content_type='image/jpeg')

        response = self.client.post('/api/ai/disease-scan/', {'image': uploaded}, format='multipart')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('crop', data)
        self.assertIn('disease', data)
        self.assertIn('confidence', data)
        self.assertIn('treatments', data)
        self.assertIsInstance(data['treatments'], list)
        self.assertGreater(len(data['treatments']), 0)

    def test_disease_scan_with_sample_key(self):
        """Verify POST /api/ai/disease-scan/ handles sample key gracefully."""
        response = self.client.post('/api/ai/disease-scan/', {'sample_key': 'corn_rust'}, format='json')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('Corn', data['crop'])
        self.assertIn('Rust', data['disease'])

    def test_crop_recommendation_endpoint(self):
        """Verify POST /api/ai/crop-recommend/ works."""
        payload = {
            "N": 90, "P": 42, "K": 43,
            "ph": 6.5, "rainfall": 202,
            "temp": 26.5, "humidity": 82
        }
        response = self.client.post('/api/ai/crop-recommendation/', payload, format='json')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('topCrop', data)
