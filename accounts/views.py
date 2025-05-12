from django.shortcuts import render
from django.urls import reverse_lazy
from django.views import generic
from .serializers import UserSignupSerializer, LoginSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from .forms import CustomProfessorUserCreationForm
from django.contrib.auth import login

# Create your views here.


class SignupPageView(generic.CreateView):
    form_class = CustomProfessorUserCreationForm
    success_url = reverse_lazy("student_data")
    template_name = "registration/signup.html"


class SignupAPIView(CreateAPIView):
    serializer_class = UserSignupSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"message": "User created successfully", "username": user.username},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            login(request, user)
            return Response(
                {"message": "Login successful", "username": user.username},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
