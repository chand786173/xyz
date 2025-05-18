from django.urls import path
from .views import store_user_data

urlpatterns = [
     path('', store_user_data),
    path('submit/', store_user_data),
]

