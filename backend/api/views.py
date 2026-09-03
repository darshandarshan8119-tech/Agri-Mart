from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .ml.disease_loader import disease_handler
from .ml.recommendation_loader import rec_handler
from .ml.yield_loader import yield_handler

# Auth Views
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email', '')
    password = request.data.get('password', '')
    if not email or not password:
        return Response({'error': 'Please provide email and password.'}, status=status.HTTP_400_BAD_REQUEST)
    
    display_name = email.split('@')[0] if '@' in email else email
    return Response({
        'message': f'Welcome back, {display_name}!',
        'user': {
            'email': email,
            'fullname': display_name.capitalize(),
            'role': 'farmer',
            'token': 'agrimart_django_jwt_token_simulation'
        }
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    fullname = request.data.get('fullname', '')
    email = request.data.get('email', '')
    role = request.data.get('role', 'farmer')

    if not fullname or not email:
        return Response({'error': 'Full name and email are required.'}, status=status.HTTP_400_BAD_REQUEST)

    return Response({
        'message': f'Account registered successfully for {fullname}!',
        'user': {
            'fullname': fullname,
            'email': email,
            'role': role,
            'token': 'agrimart_django_jwt_token_simulation'
        }
    }, status=status.HTTP_201_CREATED)


# AI Feature Views
@api_view(['POST'])
@permission_classes([AllowAny])
def disease_scan_view(request):
    image_file = request.FILES.get('image')
    if not image_file and not request.data.get('sample_key'):
        # Fall back to default sample diagnosis if no file provided
        result = disease_handler.predict(None) if hasattr(disease_handler, 'predict') else {}
        return Response(result)

    result = disease_handler.predict(image_file) if image_file else {
        "crop": "Tomato (Solanum lycopersicum)",
        "disease": "Early Blight (Alternaria solani)",
        "confidence": "96.8%",
        "bar_width": "96.8%",
        "symptoms": "Dark brown concentric ring spots on lower foliage leading to chlorosis.",
        "treatments": [
            "Prune and destroy infected bottom foliage.",
            "Apply Mancozeb 75 WP (2g/L) or Copper Oxychloride 50 WP (2.5g/L) spray.",
            "Transition irrigation to ground drip to prevent water splashing spores."
        ]
    }
    return Response(result)


@api_view(['POST'])
@permission_classes([AllowAny])
def crop_recommendation_view(request):
    data = request.data
    N = float(data.get('N', 90))
    P = float(data.get('P', 42))
    K = float(data.get('K', 43))
    ph = float(data.get('ph', 6.5))
    rainfall = float(data.get('rainfall', 202))
    temp = float(data.get('temp', 26.5))
    humidity = float(data.get('humidity', 82))

    res = rec_handler.predict(N, P, K, ph, rainfall, temp, humidity)
    return Response(res)


@api_view(['POST'])
@permission_classes([AllowAny])
def yield_prediction_view(request):
    data = request.data
    crop = data.get('crop', 'rice')
    acres = float(data.get('acres', 5))
    irrigation = data.get('irrigation', 'drip')
    fertilizer = data.get('fertilizer', 'balanced')

    res = yield_handler.predict(crop, acres, irrigation, fertilizer)
    return Response(res)


@api_view(['GET'])
@permission_classes([AllowAny])
def growth_tracker_view(request):
    return Response({
        "current_batch": "Wheat Field #3 (Planted 48 Days Ago)",
        "active_phase": "Phase 3: Tillering & Stem Extension",
        "ndvi_score": 0.78,
        "ndvi_rating": "Vibrant Green Canopy (Healthy)",
        "steps": [
            { "num": 1, "label": "Germination", "dates": "Days 1 - 10", "status": "completed" },
            { "num": 2, "label": "Seedling Emergence", "dates": "Days 11 - 28", "status": "completed" },
            { "num": 3, "label": "Tillering & Stemming", "dates": "Days 29 - 60 (Active - 80%)", "status": "current" },
            { "num": 4, "label": "Booting & Flowering", "dates": "Days 61 - 85 (Upcoming)", "status": "pending" },
            { "num": 5, "label": "Grain Filling & Ripening", "dates": "Days 86 - 120 (Harvest)", "status": "pending" }
        ]
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def market_prices_view(request):
    rates = [
        { "commodity": "🌾 Wheat (Lokwan)", "mandi": "Kalyan APMC, Maharashtra", "arrivals": "1,240", "min": "2,280", "max": "2,540", "modal": "2,450", "forecast": "Bullish (+4%) 📈", "forecastClass": "bullish" },
        { "commodity": "🌾 Paddy (Common)", "mandi": "Burdwan Mandi, West Bengal", "arrivals": "3,100", "min": "2,150", "max": "2,380", "modal": "2,290", "forecast": "Stable (±1%) ⚖️", "forecastClass": "stable" },
        { "commodity": "🌽 Maize (Yellow)", "mandi": "Davanagere, Karnataka", "arrivals": "890", "min": "1,920", "max": "2,210", "modal": "2,100", "forecast": "Rising (+2.5%) 📈", "forecastClass": "bullish" },
        { "commodity": "🌱 Soybean (Yellow)", "mandi": "Ujjain APMC, MP", "arrivals": "2,450", "min": "4,350", "max": "4,780", "modal": "4,620", "forecast": "Bearish (-2%) 📉", "forecastClass": "bearish" },
        { "commodity": "🍅 Tomato", "mandi": "Kolar Market, Karnataka", "arrivals": "4,600", "min": "1,400", "max": "1,950", "modal": "1,780", "forecast": "High Demand (+8%) 📈", "forecastClass": "bullish" }
    ]
    return Response({"rates": rates})
