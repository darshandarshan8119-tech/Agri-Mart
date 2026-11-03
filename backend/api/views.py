import base64
import json
import mimetypes
import os
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings
from django.shortcuts import render
from django.utils.translation import gettext_lazy as _
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .ml.disease_loader import disease_handler
from .ml.recommendation_loader import rec_handler
from .models import MarketObservation, MarketSyncLog

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


@api_view(['GET'])
@permission_classes([AllowAny])
def market_observations_view(request):
    """Return source-attributed daily observations; intentionally never fabricates a quote."""
    records = MarketObservation.objects.all()
    demo_requested = request.query_params.get('include_demo') == '1'
    # Never mix demonstrations into official results. Demo records are returned
    # only after the client explicitly asks for them as a fallback.
    records = records.filter(data_kind='demo' if demo_requested else 'official')
    for field in ('state', 'district', 'commodity', 'variety'):
        value = request.query_params.get(field, '').strip()
        if value:
            records = records.filter(**{f'{field}__iexact': value})
    market = request.query_params.get('market', '').strip()
    if market:
        records = records.filter(market_name__iexact=market)
    observed = request.query_params.get('date', '').strip()
    if observed:
        records = records.filter(arrival_date=observed)
    results = [{
        'id': item.id, 'state': item.state, 'district': item.district,
        'market_name': item.market_name, 'commodity': item.commodity,
        'variety': item.variety, 'arrival_date': item.arrival_date.isoformat(),
        'min_price': float(item.min_price), 'max_price': float(item.max_price),
        'modal_price': float(item.modal_price), 'arrival_quantity': float(item.arrival_quantity) if item.arrival_quantity is not None else None,
        'price_unit': item.price_unit, 'source_name': item.source_name,
        'source_url': item.source_url, 'data_kind': item.data_kind, 'estimated_distance_km': float(item.estimated_distance_km) if item.estimated_distance_km is not None else None,
        'market_charge_estimate': float(item.market_charge_estimate) if item.market_charge_estimate is not None else None,
    } for item in records[:200]]
    latest = MarketObservation.objects.order_by('-arrival_date').values_list('arrival_date', flat=True).first()
    return Response({'results': results, 'count': len(results), 'latest_available_observation_date': latest.isoformat() if latest else None, 'data_kind': 'demo' if demo_requested else 'official', 'data_policy': 'Demonstration data only; never use it for a selling decision.' if demo_requested else 'Daily source observations; not real-time quotes or guaranteed sale prices.'})


@api_view(['GET'])
@permission_classes([AllowAny])
def market_sync_status_view(request):
    """Small operational status payload for the dashboard; credentials remain server-only."""
    latest = MarketSyncLog.objects.first()
    if not latest:
        return Response({'last_successful_synchronization': None, 'status': 'not_started'})
    last_success = MarketSyncLog.objects.filter(status__in=['success', 'partial']).first()
    return Response({
        'status': latest.status,
        'last_successful_synchronization': last_success.finished_at.isoformat() if last_success and last_success.finished_at else None,
        'latest_run': {'started_at': latest.started_at.isoformat(), 'finished_at': latest.finished_at.isoformat() if latest.finished_at else None, 'records_fetched': latest.records_fetched, 'records_inserted': latest.records_inserted, 'records_updated': latest.records_updated, 'failed_requests': latest.failed_requests},
    })


ASSISTANT_TOOLS = [
    {"type": "function", "function": {"name": "get_market_prices", "description": "Get the Agri-MART market prices and sell/hold advice currently available in the project.", "parameters": {"type": "object", "properties": {}}}},
    {"type": "function", "function": {"name": "recommend_crop", "description": "Run the project's crop recommendation model. Ask for missing values before calling; use defaults only when the farmer accepts them.", "parameters": {"type": "object", "properties": {"N": {"type": "number"}, "P": {"type": "number"}, "K": {"type": "number"}, "ph": {"type": "number"}, "rainfall": {"type": "number"}, "temp": {"type": "number"}, "humidity": {"type": "number"}}, "required": ["N", "P", "K", "ph", "rainfall", "temp", "humidity"]}}},
    {"type": "function", "function": {"name": "diagnose_uploaded_leaf", "description": "Return the result from the project's disease model for the image the farmer uploaded. Call only when an image is available.", "parameters": {"type": "object", "properties": {}}}},
]

SYSTEM_PROMPT = """You are Agri-MART's warm, intelligent farming companion for Indian farmers. Hold a natural conversation, remember what the farmer has said in the supplied conversation, and reply in the farmer's requested language (Kannada, Hindi, or English). Never sound like a dashboard or a canned feature list.

For a broad question such as "crop disease" or "my plant is sick", do NOT name a disease. Respond naturally, acknowledge the concern, and ask for either a clear photo plus the crop name or one useful symptom (spots, yellowing, curling, wilting, insects). Use diagnose_uploaded_leaf only after a photo is available. Make it clear that the result is advisory and a local agricultural officer should be contacted for severe outbreaks.

Use project tools only when they add a fact: current market data, provided soil readings, or an uploaded leaf image. Never invent prices, diagnoses, or model results. If inputs for a tool are missing, ask one short, friendly follow-up question rather than guessing. Explain recommendations in simple everyday terms, and for pesticide advice remind the farmer to follow the label and local regulations. Your job is to help the farmer think through their situation, not just display cards."""


def _openrouter_completion(messages, tools=None):
    """Small dependency-free OpenRouter client; API key stays on the server."""
    api_key = settings.OPENROUTER_API_KEY
    if not api_key:
        raise RuntimeError('OPENROUTER_API_KEY is not configured on the server.')
    payload = {"model": settings.OPENROUTER_MODEL, "messages": messages, "temperature": 0.25, "max_tokens": 700}
    if tools:
        payload.update({"tools": tools, "tool_choice": "auto", "parallel_tool_calls": False})
    req = Request('https://openrouter.ai/api/v1/chat/completions', data=json.dumps(payload).encode('utf-8'), headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json", "HTTP-Referer": "http://localhost:5173", "X-Title": "Agri-MART"})
    try:
        with urlopen(req, timeout=45) as response:
            return json.loads(response.read().decode('utf-8'))['choices'][0]['message']
    except HTTPError as exc:
        detail = exc.read().decode('utf-8', errors='replace')
        raise RuntimeError(f'OpenRouter request failed ({exc.code}): {detail[:300]}') from exc
    except URLError as exc:
        raise RuntimeError('Could not reach OpenRouter. Check the server internet connection.') from exc


def _tool_result(name, args, image_file=None):
    if name == 'get_market_prices':
        records = list(MarketObservation.objects.order_by('-arrival_date')[:20])
        if not records:
            return {
                'observations': [],
                'message': 'No verified market observation is currently stored. Do not quote a price; explain that a source sync is needed.'
            }, None, {}
        observations = [{
            'commodity': row.commodity, 'variety': row.variety,
            'market': row.market_name, 'district': row.district,
            'modal_price': float(row.modal_price), 'unit': row.price_unit,
            'observation_date': row.arrival_date.isoformat(), 'source': row.source_name,
        } for row in records]
        first = observations[0]
        return {'observations': observations, 'data_policy': 'Daily observations, not live quotes.'}, 'price', {
            'commodity': first['commodity'], 'mandi': first['market'],
            'currentPrice': first['modal_price'], 'observationDate': first['observation_date'],
            'source': first['source'],
        }
    if name == 'recommend_crop':
        result = rec_handler.predict(**{key: float(args[key]) for key in ('N', 'P', 'K', 'ph', 'rainfall', 'temp', 'humidity')})
        top = result['topCrop']
        return result, 'recommendation', {"soilType": "Farmer-provided soil readings", "npk": f"N:{args['N']} P:{args['P']} K:{args['K']} • pH {args['ph']}", "topCrop": top['title'], "topEmoji": top['emoji'], "match": top['match'], "expectedYield": top.get('yield', 'Varies'), "desc": top['desc'], "secondaryCrop": (result.get('secondCrop') or {}).get('title', '—')}
    if name == 'diagnose_uploaded_leaf' and image_file:
        result = disease_handler.predict(image_file)
        if result.get('error'):
            return result, None, {}
        # The disease loader may return either 0.803 or the already-formatted
        # string "80.3%". Normalise both forms so photo uploads cannot crash.
        confidence = str(result.get('confidence', '—')).strip()
        try:
            if confidence.endswith('%'):
                confidence = f"{float(confidence[:-1]):.1f}%"
            else:
                confidence = f"{float(confidence) * 100:.1f}%"
        except ValueError:
            confidence = '—'
        return result, 'disease', {"crop": result['crop'], "diseaseName": result['disease'], "confidence": confidence, "severity": result['severity'], "symptoms": result['symptoms'], "organicCure": result.get('organic_alt', ''), "chemicalCure": '; '.join(result.get('treatments', []))}
    return {"error": "The requested tool is unavailable."}, None, {}


@api_view(['POST'])
@permission_classes([AllowAny])
def ai_assistant_view(request):
    message = str(request.data.get('message', '')).strip()
    language = str(request.data.get('language', 'en'))
    image_file = request.FILES.get('image')
    if not message and not image_file:
        return Response({'error': 'Please say, type, or upload something for the assistant.'}, status=status.HTTP_400_BAD_REQUEST)
    if image_file and image_file.size > 8 * 1024 * 1024:
        return Response({'error': 'Please upload an image smaller than 8 MB.'}, status=status.HTTP_400_BAD_REQUEST)

    user_content = message or 'Please examine my uploaded farm image.'
    messages = [{"role": "system", "content": SYSTEM_PROMPT + f" The selected interface language is {language}."}]
    try:
        history = json.loads(request.data.get('history', '[]'))
        if not isinstance(history, list):
            history = []
        for turn in history[-10:]:
            role = turn.get('role') if isinstance(turn, dict) else None
            content = turn.get('content') if isinstance(turn, dict) else None
            if role in ('user', 'assistant') and isinstance(content, str) and content.strip():
                messages.append({'role': role, 'content': content[:2500]})
    except (TypeError, ValueError, json.JSONDecodeError):
        pass
    messages.append({"role": "user", "content": user_content})
    if image_file:
        # The project model remains the source of the actual leaf diagnosis. The image is also
        # available to a vision-capable OpenRouter model for general soil/field questions.
        raw = image_file.read()
        image_file.seek(0)
        mime = image_file.content_type or mimetypes.guess_type(image_file.name)[0] or 'image/jpeg'
        messages[-1]['content'] = [{"type": "text", "text": user_content}, {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{base64.b64encode(raw).decode('ascii')}"}}]

    # A leaf photo should always reach the existing project classifier, even if a
    # provider decides not to issue a tool call. Other photo types remain a
    # vision question for the selected OpenRouter model.
    initial_card_type, initial_card_data = None, {}
    leaf_words = ('leaf', 'leaves', 'disease', 'spot', 'blight', 'rust', 'pest', 'ರೋಗ', 'ಎಲೆ', 'बीमारी', 'पत्ता')
    if image_file and (not message or any(word in message.lower() for word in leaf_words)):
        result, initial_card_type, initial_card_data = _tool_result('diagnose_uploaded_leaf', {}, image_file)
        messages[0]['content'] += "\nThe project's leaf classifier returned this result; use it as the diagnosis source: " + json.dumps(result)

    try:
        first = _openrouter_completion(messages, ASSISTANT_TOOLS)
        card_type, card_data = initial_card_type, initial_card_data
        # Limit the tool loop to prevent a bad provider response from consuming unbounded credits.
        for _ in range(3):
            calls = first.get('tool_calls') or []
            if not calls:
                break
            messages.append(first)
            for call in calls:
                args = json.loads(call['function'].get('arguments') or '{}')
                result, selected_card, selected_data = _tool_result(call['function']['name'], args, image_file)
                card_type, card_data = selected_card or card_type, selected_data or card_data
                messages.append({"role": "tool", "tool_call_id": call['id'], "content": json.dumps(result)})
            first = _openrouter_completion(messages, ASSISTANT_TOOLS)
        content = first.get('content') or 'I could not complete that farm request. Please try again.'
        return Response({"content": content, "card_type": card_type, "card_data": card_data, "actions": []})
    except (RuntimeError, KeyError, ValueError, TypeError) as exc:
        return Response({'error': str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
