from django.contrib import admin
from .models import Student
# Register your models here.
class FacultyAdmin(admin.ModelAdmin):
    list_display = (
        "student_id",
        "student_name",
        "student_section",
        "professor_name",
    )
admin.site.register(Student, FacultyAdmin)