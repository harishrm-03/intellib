from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    RegisterView,
    NoteViewSet,
    ChatView,
    ChatHistoryView,
    UserListView,
)

router = DefaultRouter()
router.register('notes', NoteViewSet, basename='notes')

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # AI Chat
    path('chat/', ChatView.as_view(), name='chat'),
    path('history/', ChatHistoryView.as_view(), name='chat-history'),

    # Admin
    path('users/', UserListView.as_view(), name='user-list'),

    # Notes CRUD
    path('', include(router.urls)),
]