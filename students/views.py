from django.shortcuts import render, get_object_or_404
from rest_framework import generics
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from rest_framework.exceptions import NotFound
from .models import Students, Subject, Grade
from django.views.generic.edit import DeleteView, UpdateView, CreateView
import logging 
from rest_framework.generics import ListAPIView
from rest_framework.exceptions import APIException
from .serializers import (
    StudentSerializer,
    StudentSubjectSerializer,
    StudentGradeSerializer,
)

# Create your views here.

# Student starts here


# Student_list for querying the students
def student_list(request):
    student_query = Students.objects.all()
    return render(request, "student_data.html", {"student_query": student_query})


# view to create a student
class student_create(CreateView):
    # takes the table Students as a model
    model = Students
    # the html template
    template_name = "student_create.html"
    # the fields(or forms) that are shown
    fields = [
        "studentid",
        "firstname",
        "lastname",
        "middlename",
        "enrollmentyear",
        "curriculumid",
        "curriculum",
        "studentnumber",
    ]

    # if successful redirect to student_data which is our home
    success_url = reverse_lazy("student_data")


# delete a student view
class student_delete(DeleteView):
    model = Students
    template_name = "student_delete.html"
    success_url = reverse_lazy("student_data")


# update a student view
class StudentUpdate(UpdateView):
    model = Students
    template_name = "student_edit.html"
    fields = [
        "studentid",
        "firstname",
        "lastname",
        "middlename",
        "enrollmentyear",
        "curriculumid",
        "curriculum",
        "studentnumber",
    ]
    success_url = reverse_lazy("student_data")


# LIst all students and create a new one
class StudentListCreateApi(generics.ListCreateAPIView):
    queryset = Students.objects.all()
    serializer_class = StudentSerializer


# Retrieve, update, delete student
class StudentRetrieveUpdateDeleteAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Students.objects.all()
    serializer_class = StudentSerializer

    def get_object(self):
        studentid = self.kwargs["studentid"]
        return get_object_or_404(Students, studentid=studentid)


# ENd of students

# Start of subjects


# Subject list queryable
def subject_list(request):
    subject_query = Subject.objects.all()
    return render(request, "subject_data.html", {"subject_query": subject_query})


# List all subjects
class subject_create(CreateView):
    model = Subject
    template_name = "subject_create.html"
    fields = [
        "subjectcode",
        "subjecttitle",
        "units",
        "prerequisite",
        "semester",
        "yearlevel",
    ]

    success_url = reverse_lazy("student_data")


class subject_delete(DeleteView):
    model = Subject
    template_name = "subject_delete.html"
    success_url = reverse_lazy("student_data")


class subject_edit(CreateView):
    model = Subject
    template_name = "subject_edit.html"
    fields = [
        "subjectcode",
        "subjecttitle",
        "units",
        "prerequisite",
        "semester",
        "yearlevel",
    ]

    success_url = reverse_lazy("student_data")


# APis for subjects


class StudentSubjectCreateApi(generics.ListCreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = StudentSubjectSerializer


# Retrieve, update, delete student
class StudentSubjectRetrieveUpdateDeleteAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subject.objects.all()
    serializer_class = StudentSubjectSerializer

    def get_queryset(self):
        studentid = self.kwargs["studentid"]
        subjectcode = self.kwargs["subjectcode"]
        return Subject.objects.filter(studentid=studentid, subjectcode=subjectcode)


# end of subjects

# Start of grades


# Subject list queryable
def grades_list(request):
    grades_query = Subject.objects.all()
    return render(request, "grade_data.html", {"grades_query": grades_query})


# List all subjects
class grades_create(CreateView):
    model = Grade
    template_name = "grade_create.html"
    fields = ["gradeid", "studentid", "subjectcode", "semester", "grade", "units"]

    success_url = reverse_lazy("student_data")


class grade_delete(DeleteView):
    model = Grade
    template_name = "grade_delete.html"
    success_url = reverse_lazy("student_data")


class grade_edit(CreateView):
    model = Grade
    template_name = "grade_edit.html"
    fields = ["gradeid", "studentid", "subjectcode", "semester", "grade", "units"]

    success_url = reverse_lazy("student_data")



class StudentGradesListAPI(generics.ListAPIView):
    queryset = Grade.objects.all()
    serializer_class = StudentGradeSerializer

# Retrieve, update, delete student
class StudentGradesRetrieveUpdateDeleteAPI(ListAPIView):
    serializer_class = StudentGradeSerializer

    def get_queryset(self):
        student_id = self.kwargs['studentid']
        return Grade.objects.filter(studentid=student_id)
