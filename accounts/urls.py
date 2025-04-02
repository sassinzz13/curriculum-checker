from django.urls import path
from .views import SignupPageView, SignupAPIView, LoginAPIView
urlpatterns = [
    path("signup/", SignupPageView.as_view(), name="signup"),
      path("api/signup/", SignupAPIView.as_view(), name="signupAPI"),
       path("api/login/", LoginAPIView.as_view(), name="loginAPI"),
]