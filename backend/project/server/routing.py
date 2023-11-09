from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('room/<str:room_name>/', consumers.ChatConsumer.as_asgi()),
]