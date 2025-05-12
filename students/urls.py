from django.urls import path
from .views import student_list,grades_list,subject_delete,subject_list,grade_delete, grade_edit, grades_create, grades_create, subject_edit, subject_create,student_delete, StudentUpdate, student_create, StudentListCreateApi, StudentRetrieveUpdateDeleteAPI, StudentSubjectCreateApi,StudentSubjectRetrieveUpdateDeleteAPI,StudentGradesListAPI

urlpatterns = [
    # path("studentDetails/<int:pk>/", student_detail, name="student_detail"),
    path("student_query/<str:pk>/delete/", student_delete.as_view(), name="student_delete" ),
    path("student_query/<str:pk>/edit/", StudentUpdate.as_view(), name="student_edit" ),
    path("student_query/new/", student_create.as_view(), name="student_create" ),


    path("subjects/", subject_list, name="subject_data"),
    path('subject/create/', subject_create.as_view(), name='subject_create'),
    path('subject/<str:pk>/edit/', subject_edit.as_view(), name='subject_edit'),
    path('subject/delete/<str:pk>/', subject_delete.as_view(), name='subject_delete'),
    
    path("grades/", grades_list, name="grade_data"),
    path("grades/create/", grades_create.as_view(), name="grade_create"),
    path("grades/<str:pk>/edit/", grade_edit.as_view(), name="grade_edit"),
    path("grades/<str:pk>/delete/", grade_delete.as_view(), name="grade_delete"),
    

    
    path("", student_list, name="student_data"),
    
    # API Endpoints
    path("api/students/", StudentListCreateApi.as_view(), name="student_details_create"),
    path("api/students/<str:studentid>/", StudentRetrieveUpdateDeleteAPI.as_view(), name="student_detail"),
    path('api/students/<str:studentid>/subjects/', StudentSubjectCreateApi.as_view(), name="api_student_subject_create_list"),
    path('api/students/<str:studentid>/subjects/<str:subject_code>/', StudentSubjectRetrieveUpdateDeleteAPI.as_view(), name="api_student_subject_detail"),
    path('api/students/<str:studentid>/grades/', StudentGradesListAPI.as_view(), name="api_student_grades_list"),
]