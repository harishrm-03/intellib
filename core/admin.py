from django.contrib import admin
from .models import Note, ChatMessage


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at', 'updated_at')
    list_filter = ('created_at',)
    search_fields = ('title', 'content', 'user__username')


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('message', 'user__username')