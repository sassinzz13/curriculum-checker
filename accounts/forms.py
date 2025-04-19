from django.contrib.auth import get_user_model

from django.contrib.auth.forms import UserCreationForm, UserChangeForm

# creates a professor to log in
class CustomProfessorUserCreationForm(UserCreationForm):
    class Meta:
        model = get_user_model()
        fields = (
            "username",
            "first_name",
            "last_name",
            "email"
        )
class CustomProfessorUserChangeForm(UserChangeForm):
    class Meta:
        model = get_user_model()
        fields = (
            "username",
            "first_name",
            "last_name",
            "email"
        )
