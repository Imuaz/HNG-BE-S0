from django.urls import path
from .views import ClassifyNumber

urlpatterns = [
    path("api/classify-number/", ClassifyNumber.as_view(), name="classify_number"),
]
