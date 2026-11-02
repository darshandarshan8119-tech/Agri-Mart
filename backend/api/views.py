from django.shortcuts import render
from django.utils.translation import gettext_lazy as _
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .ml.disease_loader import disease_handler
from .ml.recommendation_loader import rec_handler
from .ml.yield_loader import yield_handler

def home_template_view(request):
    """
    Renders the Agri-MART home template with full i18n support.
    """
    return render(request, 'index.html')

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
    """
    POST /api/ai/disease-scan/
    Accepts multipart/form-data with an 'image' field (leaf photo).
    Delegates preprocessing and inference to disease_handler (singleton).
    """
    image_file = request.FILES.get('image')
    sample_key = request.data.get('sample_key')
    result = disease_handler.predict(image_file, sample_key=sample_key)
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


# Comprehensive Market Price Analysis & Risk Alert Endpoint
@api_view(['GET'])
@permission_classes([AllowAny])
def market_prices_view(request):
    commodities = [
        {
            "id": "wheat-ludhiana",
            "name": "Wheat (Sharbati)",
            "mandi": "Ludhiana APMC, Punjab",
            "price": 2450,
            "prevPrice": 2390,
            "change": "+2.4%",
            "isUp": True,
            "dayHigh": 2480,
            "dayLow": 2410,
            "volume": "4,250 Qtl",
            "agmarknetBenchmark": 2275,
            "grade": "Grade-A Sharbati",
            "moisture": "11.2%",
            "riskLevel": "LOW",
            "action": "HOLD",
            "recommendationReason": "Expected 7-day modal gain (+₹60/Qtl) exceeds storage cost (₹4.2/Qtl).",
            "projected7Day": 2510
        },
        {
            "id": "mustard-alwar",
            "name": "Mustard (Pusa Bold)",
            "mandi": "Alwar APMC, Rajasthan",
            "price": 5680,
            "prevPrice": 5580,
            "change": "+1.8%",
            "isUp": True,
            "dayHigh": 5720,
            "dayLow": 5550,
            "volume": "2,890 Qtl",
            "agmarknetBenchmark": 5650,
            "grade": "High-Oil 42% Pusa Bold",
            "moisture": "7.8%",
            "riskLevel": "LOW",
            "action": "HOLD",
            "recommendationReason": "Crusher extraction demand high. Strong buyer absorption.",
            "projected7Day": 5790
        },
        {
            "id": "cotton-rajkot",
            "name": "Cotton (Shankar-6)",
            "mandi": "Rajkot APMC, Gujarat",
            "price": 7140,
            "prevPrice": 7180,
            "change": "-0.6%",
            "isUp": False,
            "dayHigh": 7220,
            "dayLow": 7110,
            "volume": "6,400 Bales",
            "agmarknetBenchmark": 7020,
            "grade": "29mm Shankar-6",
            "moisture": "8.4%",
            "riskLevel": "HIGH_DOWNSIDE",
            "action": "LIQUIDATE",
            "recommendationReason": "Spinning mill demand soft; arrivals increasing +12%. Liquidate immediately.",
            "projected7Day": 7040
        },
        {
            "id": "paddy-karnal",
            "name": "Basmati Paddy 1121",
            "mandi": "Karnal APMC, Haryana",
            "price": 4420,
            "prevPrice": 4290,
            "change": "+3.1%",
            "isUp": True,
            "dayHigh": 4460,
            "dayLow": 4280,
            "volume": "5,120 Qtl",
            "agmarknetBenchmark": 3850,
            "grade": "Export Grade 8.35mm",
            "moisture": "12.0%",
            "riskLevel": "LOW",
            "action": "HOLD",
            "recommendationReason": "Export demand strong. Millers actively building inventory.",
            "projected7Day": 4540
        }
    ]
    return Response({
        "status": "success",
        "market": "APMC Realtime Market Intelligence",
        "commodities": commodities
    })


# AI Assistant Endpoint
@api_view(['POST'])
@permission_classes([AllowAny])
def ai_assistant_view(request):
    query = request.data.get('message', '').strip().lower()
    
    if 'disease' in query or 'leaf' in query:
        return Response({
            "content": "Leaf diagnosis engine active. Early blight symptoms identified for tomato leaves. Apply Trichoderma harzianum or copper oxychloride.",
            "card_type": "disease",
            "card_data": {
                "crop": "Tomato (Solanum lycopersicum)",
                "diseaseName": "Early Blight (Alternaria solani)",
                "confidence": "96.4%",
                "severity": "Moderate Infection"
            }
        })
    elif 'price' in query or 'wheat' in query or 'market' in query:
        return Response({
            "content": "Wheat (Sharbati) at Ludhiana APMC is trading at ₹2,450/Qtl (+2.4% today). Statutory MSP benchmark is ₹2,275/Qtl. Hold recommendation active.",
            "card_type": "price",
            "card_data": {
                "commodity": "Wheat (Sharbati)",
                "mandi": "Ludhiana APMC, Punjab",
                "currentPrice": 2450,
                "change": "+2.4%",
                "dayHigh": 2480,
                "dayLow": 2410
            }
        })
    else:
        return Response({
            "content": "Agri-MART AI Copilot ready. I can assist with market prices, risk alerts, leaf diagnosis, soil recommendation, and yield estimation.",
            "card_type": None,
            "card_data": {}
        })
