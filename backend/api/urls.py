from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('auth/login/', views.login_view, name='login'),
    path('auth/register/', views.register_view, name='register'),

    # AI Feature Endpoints
    path('ai/disease-scan/', views.disease_scan_view, name='disease_scan'),
    path('ai/crop-recommendation/', views.crop_recommendation_view, name='crop_recommendation'),
    path('ai/assistant/', views.ai_assistant_view, name='ai_assistant'),

    # Source-attributed daily market observations
    path('market/observations/', views.market_observations_view, name='market_observations'),
    path('market/sync-status/', views.market_sync_status_view, name='market_sync_status'),
]
