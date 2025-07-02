from django.shortcuts import render
from .models import Course, Assignment
from rest_framework import viewsets
from .models import Classroom, Enrollment, Submission, Topic, User
from django.conf import settings
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import UserSerializer, ClassroomSerializer, EnrollmentSerializer, CourseSerializer, AssignmentSerializer, SubmissionSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model


User = get_user_model()

def course_list(request):
    courses = Course.objects.all()
    return render(request, 'school/course_list.html', {'courses': courses})

def assignment_detail(request, pk):
    assignment = Assignment.objects.get(pk=pk)
    return render(request, 'school/assignment_detail.html', {'assignment': assignment})

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    @action(detail=False, methods=['post'], url_path='login_or_register', permission_classes=[AllowAny])
    def login_or_register(self, request, *args, **kwargs):
        name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, username=name, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            serializer = self.get_serializer(user)
            return Response({
                "user": serializer.data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        else:
            serializer = UserSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "user": serializer.data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        #role = self.request.data.get('role')
        #if role == User.Role.ADMIN and not self.request.user.is_staff:
        #    from rest_framework.exceptions import PermissionDenied
        #    raise PermissionDenied("Only staff can create admin users.")
        

class ClassroomViewSet(viewsets.ModelViewSet):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='my')
    def my_classes(self, request):
        user = request.user
        #token = VerifyToken.for_user(user)
        classrooms = Classroom.objects.filter(enrollments__student=user)
        serializer = self.get_serializer(classrooms, many=True)
        return Response(serializer.data)
        
    @action(detail=False, methods=['get'], url_path='all', permission_classes=[AllowAny])
    def all_classes(self, request):
        classrooms = Classroom.objects.all()
        serializer = self.get_serializer(classrooms, many=True)
        return Response(serializer.data)



class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='my')
    def my_courses(self, request):
        user = request.user
        #token = VerifyToken.for_user(user)
        #courses = Course.objects.filter(classrooms=Classroom.objects.filter(enrollments__student=user))
        courses = Course.objects.filter(classrooms__enrollments__student=user).distinct()
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)
        
    @action(detail=False, methods=['get'], url_path='all', permission_classes=[AllowAny])
    def all_classes(self, request):
        courses = Course.objects.all()
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer

