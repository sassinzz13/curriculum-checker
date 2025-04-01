from django.shortcuts import render
from .models import Student
# Create your views here.

def student_list(request):
    student_query = Student.objects.all()
    return render(request, "student_data.html", {'student_query': student_query})


