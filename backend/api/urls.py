from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('auth/login/', views.login_view, name='login'),
    path('auth/register/', views.register_view, name='register'),

    # AI Feature Endpoints
    path('ai/disease-scan/', views.disease_scan_view, name='disease_scan'),
    path('ai/crop-recommendation/', views.crop_recommendation_view, name='crop_recommendation'),
    path('ai/yield-prediction/', views.yield_prediction_view, name='yield_prediction'),
    path('ai/growth-tracker/', views.growth_tracker_view, name='growth_tracker'),

    # Market Rates
    path('market/prices/', views.market_prices_view, name='market_prices'),
]
