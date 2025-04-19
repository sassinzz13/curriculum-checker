from django.contrib import admin
from .models import AccountsCustomstudentuser
# Register your models here.
class FacultyAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "password",
        "last_login",
        "is_superuser",
        "username",
        "first_name",
        "last_name",
        "email",
        "is_staff",
        "is_active",
        "date_joined",
    )
admin.site.register(AccountsCustomstudentuser, FacultyAdmin)