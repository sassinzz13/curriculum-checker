from django.shortcuts import render, get_object_or_404
from rest_framework import generics
from django.urls import reverse_lazy
from .models import Student
from django.views.generic.edit import DeleteView, UpdateView,  CreateView
from .serializers import StudentSerializer
# Create your views here.

def student_list(request):
    student_query = Student.objects.all()
    return render(request, "student_data.html", {'student_query': student_query})

class student_create(CreateView):
    model = Student
    template_name = "student_create.html"
    fields = ["student_id", "student_name", "student_section", "professor_name", "prelims", "midterms", "semifinals", "finals", "gwa"]
    success_url = reverse_lazy("student_data")

class student_delete(DeleteView):
    model = Student
    template_name = "student_delete.html"
    success_url = reverse_lazy("student_data")
    

class StudentUpdate(UpdateView):
    model = Student
    template_name = "student_edit.html"
    fields = ["student_id", "student_name", "student_section", "professor_name"]
    success_url = reverse_lazy("student_data")

# LIst all students and create a new one
class StudentListCreateApi(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

#Retrieve, update, delete student
class StudentRetrieveUpdateDeleteAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    def get_object(self):
        student_id = self.kwargs["student_id"]
        return get_object_or_404(Student, student_id=student_id)
    


