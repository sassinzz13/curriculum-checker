from django.urls import path
from .views import student_list, student_delete, StudentUpdate, student_create, StudentListCreateApi, StudentRetrieveUpdateDeleteAPI

urlpatterns = [
    # path("studentDetails/<int:pk>/", student_detail, name="student_detail"),
    path("student_query/<int:pk>/delete/", student_delete.as_view(), name="student_delete" ),
    path("student_query/<int:pk>/edit/", StudentUpdate.as_view(), name="student_edit" ),
    path("student_query/new/", student_create.as_view(), name="student_create" ),
    path("", student_list, name="student_data"),
    
    # API Endpoints
    path("api/students/", StudentListCreateApi.as_view(), name="student_details_create"),
    path("api/students/<str:student_id>/", StudentRetrieveUpdateDeleteAPI.as_view(), name="student_detail"),
]