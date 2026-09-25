from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from openai import OpenAI
from django.conf import settings

from .models import Note, ChatMessage
from .serializers import NoteSerializer, ChatMessageSerializer
from accounts.permissions import IsAdmin, IsOwnerOrAdmin

User = get_user_model()


# ------------------- Register -------------------
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        role = request.data.get("role", "USER")

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        if role not in ["USER", "MANAGER"]:
            role = "USER"  # Only Admin can create other Admins later

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username,
            password=password,
            role=role
        )
        return Response({
            "message": "User registered successfully",
            "username": user.username,
            "role": user.role
        }, status=status.HTTP_201_CREATED)


# ------------------- Notes CRUD -------------------
class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return Note.objects.all()
        return Note.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsOwnerOrAdmin()]
        return super().get_permissions()


# ------------------- AI Chat (Groq) -------------------
class ChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_message = request.data.get("message")

        if not user_message:
            return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

        client = OpenAI(
            api_key=settings.GROQ_API_KEY,
            base_url="https://api.groq.com/openai/v1"
        )

        try:
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are a helpful and friendly AI assistant."},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.7,
            )
            ai_response = completion.choices[0].message.content
        except Exception as e:
            ai_response = f"Sorry, AI service is currently unavailable. Error: {str(e)}"

        chat = ChatMessage.objects.create(
            user=request.user,
            message=user_message,
            response=ai_response
        )

        return Response(ChatMessageSerializer(chat).data, status=status.HTTP_201_CREATED)


class ChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        chats = ChatMessage.objects.filter(user=request.user)
        serializer = ChatMessageSerializer(chats, many=True)
        return Response(serializer.data)


# ------------------- Admin: List All Users -------------------
class UserListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        users = User.objects.all().values("id", "username", "email", "role", "date_joined")
        return Response(list(users))