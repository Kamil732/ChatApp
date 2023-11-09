import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer

class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        """
        Receive message from WebSocket.
        Get the event and send the appropriate event
        """
        response = json.loads(text_data)
        event = response.get("event", None)
        payload = response.get("payload", None)

        # Send message to room group
        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'send_message', # or 'send.message'
            'event': event,
            'payload': payload,
        })

    async def send_message(self, res):
        """ Receive message from room group """
        # Send message to WebSocket

        event = res.get("event", None)
        payload = res.get("payload", None)
        await self.send(text_data=json.dumps({
            'event': event,
            'payload': payload,
        }))