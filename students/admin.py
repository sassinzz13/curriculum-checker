from django.contrib import admin
from .models import Students

# Register your models here.
class StudentsAdmin(admin.ModelAdmin):
    list_display = (
        "student_id",
        "student_name",
        "student_section",
        "professor_name", 
    )

admin.site.register(Students, StudentsAdmin)
