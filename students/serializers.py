from rest_framework import serializers
from .models import Students, Grade, Subject


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Students
        fields = "__all__"


class StudentGradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = "__all__"


class StudentSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = "__all__"
