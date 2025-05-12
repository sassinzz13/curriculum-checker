from django.contrib import admin
from .models import Students

# Register your models here.
class StudentsAdmin(admin.ModelAdmin):
    list_display = (
        "studentid",
        "firstname",
        "lastname",
        "middlename", 
        "enrollmentyear",
        "curriculumid",
        "curriculum",
        "studentnumber"
    )

admin.site.register(Students, StudentsAdmin)
