from django.db import models
from django.urls import reverse

class Student(models.Model):
    student_id = models.CharField(max_length=20, unique=True)  # Ensures unique student ID
    student_name = models.CharField(max_length=50)
    student_section = models.CharField(max_length=20)
    professor_name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.student_name} ({self.student_section})"

    def get_absolute_url(self):
        return reverse("student_detail", args=[str(self.student_id)])
