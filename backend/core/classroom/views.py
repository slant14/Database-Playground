from django.shortcuts import render
from rest_framework import status, viewsets

from .models import Classroom
from .serializers import ClassSerializer


class ClassroomModelViewSet(viewsets.ModelViewSet):
    queryset = Classroom.objects.all()
    serializer_class = ClassSerializer
    permission_classes = []
