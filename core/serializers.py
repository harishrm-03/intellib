from rest_framework import serializers
from .models import Note, ChatMessage


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'message', 'response', 'created_at']
        read_only_fields = ['id', 'response', 'created_at']