from django.urls import path
from .views import student_list,grade_delete, grade_edit, grades_create, grades_create, subject_edit, subject_create,student_delete, StudentUpdate, student_create, StudentListCreateApi, StudentRetrieveUpdateDeleteAPI, StudentSubjectCreateApi,StudentSubjectRetrieveUpdateDeleteAPI,StudentGradesListAPI

urlpatterns = [
    # path("studentDetails/<int:pk>/", student_detail, name="student_detail"),
    path("student_query/<str:pk>/delete/", student_delete.as_view(), name="student_delete" ),
    path("student_query/<str:pk>/edit/", StudentUpdate.as_view(), name="student_edit" ),
    path('subject/create/', subject_create.as_view(), name='subject_create'),
    path('subject/<int:pk>/edit/', subject_edit.as_view(), name='subject_create'),
    path("student_query/new/", student_create.as_view(), name="student_create" ),
    path("grades/create/", grades_create.as_view(), name="grade_create"),
    path("grades/<int:pk>/edit/", grade_edit.as_view(), name="grade_edit"),
    path("grades/<int:pk>/delete/", grade_delete.as_view(), name="grade_delete"),
    path("", student_list, name="student_data"),
    
    # API Endpoints
    path("api/students/", StudentListCreateApi.as_view(), name="student_details_create"),
    path("api/students/<str:student_id>/", StudentRetrieveUpdateDeleteAPI.as_view(), name="student_detail"),
    path('api/students/<str:student_id>/subjects/', StudentSubjectCreateApi.as_view(), name="api_student_subject_create_list"),
    path('api/students/<str:student_id>/subjects/<str:subject_code>/', StudentSubjectRetrieveUpdateDeleteAPI.as_view(), name="api_student_subject_detail"),

    path('api/students/<str:student_id>/grades/', StudentGradesListAPI.as_view(), name="api_student_grades_list"),
]