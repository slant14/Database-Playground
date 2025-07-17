from django.shortcuts import render
from .models import Assignment
from rest_framework import viewsets
from .models import Classroom, Enrollment, Submission, User, Profile, Article
from django.conf import settings
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import UserSerializer, ClassroomSerializer, EnrollmentSerializer, AssignmentSerializer, SubmissionSerializer, ProfileSerializer, ArticleSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from django.utils import timezone


User = get_user_model()

# def course_list(request):
#    courses = Course.objects.all()
#    return render(request, 'school/course_list.html', {'courses': courses})

# def assignment_detail(request, pk):
#    assignment = Assignment.objects.get(pk=pk)
#    return render(request, 'school/assignment_detail.html', {'assignment': assignment})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['post'], url_path='login', permission_classes=[AllowAny])
    def login(self, request, *args, **kwargs):
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
            return Response({
                "error": "406"
            })

    @action(detail=False, methods=['post'], url_path='register', permission_classes=[AllowAny])
    def register(self, request, *args, **kwargs):
        name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password')
        if User.objects.filter(name=name).exists():
            return Response({
                "error": "302"
            }, status=status.HTTP_302_FOUND)
        else:
            try:
                serializer = UserSerializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                user = serializer.save()
                refresh = RefreshToken.for_user(user)
                return Response({
                    "user": serializer.data,
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    "error": "303"
                }, status=303)
        # role = self.request.data.get('role')
        # if role == User.Role.ADMIN and not self.request.user.is_staff:
        #    from rest_framework.exceptions import PermissionDenied
        #    raise PermissionDenied("Only staff can create admin users.")


class ClassroomViewSet(viewsets.ModelViewSet):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer

    @action(detail=False, methods=['post'], url_path='create')
    def create_classroom(self, request, *args, **kwargs):
        user = request.user
        data = request.data.copy()

        try:
            user_profile = user.profile
        except Profile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=status.HTTP_400_BAD_REQUEST)

        ta_ids = data.get('TA', [])
        student_ids = data.get('students', [])
        # primary_instructor_id = data.get('primary_instructor')

        if not isinstance(ta_ids, list):
            ta_ids = [ta_ids] if ta_ids else []
        if not isinstance(student_ids, list):
            student_ids = [student_ids] if student_ids else []
        # if user_profile.id not in ta_ids:
        #    ta_ids.append(user_profile.id)
        primary_instructor_id = user_profile.id

        data['TA'] = ta_ids
        data['primary_instructor'] = primary_instructor_id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        classroom = serializer.save()

        classroom.TA.set(ta_ids)

        all_participant_ids = set(ta_ids + student_ids + [primary_instructor_id])

        for participant_id in all_participant_ids:
            try:
                participant_profile = Profile.objects.get(id=participant_id)
                # participant_user = participant_profile.user

                Enrollment.objects.get_or_create(
                    student=participant_profile,
                    classroom=classroom
                )
            except Profile.DoesNotExist:
                continue

        return Response(self.get_serializer(classroom).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='my')
    def my_classes(self, request):
        user = request.user
        try:
            user_profile = user.profile
        except Profile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=400)

        student_classrooms = Classroom.objects.filter(enrollments__student=user_profile)

        TA_classrooms = Classroom.objects.filter(TA=user_profile)

        primary_classrooms = Classroom.objects.filter(primary_instructor=user_profile)

        # classrooms = (student_classrooms | TA_classrooms | primary_classrooms).distinct()

        # serializer = self.get_serializer(classrooms, many=True)
        # return Response(serializer.data)

        return Response({
            'student': ClassroomSerializer(student_classrooms, many=True).data,
            'TA': ClassroomSerializer(TA_classrooms, many=True).data,
            'primary_instructor': ClassroomSerializer(primary_classrooms, many=True).data,
        })

    @action(detail=False, methods=['get'], url_path='my/role')
    def my_role(self, request):
        classroom_id = request.query_params.get('classroom_id')
        user = request.user
        try:
            user_profile = user.profile
        except Profile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=400)

        classroom = Classroom.objects.get(id=classroom_id)
        students = User.objects.filter(enrollments__classroom=classroom_id)
        TAs = classroom.TA
        primary_instructor = classroom.primary_instructor

        roles = []

        if user in students:
            roles.append('Student')

        if user in TAs:
            roles.append('TA')

        if user in primary_instructor:
            roles.append('primary_instructor')

        return Response({'roles': roles})

    @action(detail=False, methods=['get'], url_path='students')
    def students_of_classroom(self, request):
        classroom_id = request.query_params.get('classroom_id')
        if not classroom_id:
            return Response({'error': 'classroom_id is required'}, status=400)

        classroom = Classroom.objects.get(id=classroom_id)

        users = Profile.objects.filter(enrollments__classroom=classroom_id)

        TA_ids = list(classroom.TA.values_list('id', flat=True))
        primary_instructor_id = classroom.primary_instructor.id

        students = users.exclude(id__in=TA_ids + [primary_instructor_id])

        serializer = ProfileSerializer(students, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='articles')
    def articles_of_classroom(self, request):
        classroom_id = request.query_params.get('classroom_id')
        if not classroom_id:
            return Response({'error': 'classroom_id is required'}, status=400)
        articles = Article.objects.filter(classrooms__id=classroom_id)
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='all', permission_classes=[AllowAny])
    def all_classes(self, request):
        classrooms = Classroom.objects.all()
        serializer = self.get_serializer(classrooms, many=True)
        return Response(serializer.data)


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer


# class CourseViewSet(viewsets.ModelViewSet):
#    queryset = Course.objects.all()
#    serializer_class = CourseSerializer
#    permission_classes = [IsAuthenticated]

    # @action(detail=False, methods=['get'], url_path='my')
    # def my_courses(self, request):
    #    user = request.user
    #    #token = VerifyToken.for_user(user)
    #    #courses = Course.objects.filter(classrooms=Classroom.objects.filter(enrollments__student=user))
    #    courses = Course.objects.filter(classrooms__enrollments__student=user).distinct()
    #    serializer = self.get_serializer(courses, many=True)
    #    return Response(serializer.data)

    # @action(detail=False, methods=['get'], url_path='all', permission_classes=[AllowAny])
    # def all_courses(self, request):
    #   courses = Course.objects.all()
    #    serializer = self.get_serializer(courses, many=True)
    #    return Response(serializer.data)

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='create')
    def create_assignment(self, request):
        classroom_id = request.query_params.get('classroom_id')

        if not classroom_id:
            return Response({'error': 'classroom_id is required'}, status=400)
        try:
            classroom = Classroom.objects.get(id=classroom_id)
        except Classroom.DoesNotExist:
            return Response({'error': 'Classroom not found'}, status=404)

        data = request.data.copy()
        data['classroom'] = classroom_id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        assignments = serializer.save()
        return Response(self.get_serializer(assignments).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='my')
    def my_assignments(self, request):
        user = request.user
        try:
            user_profile = user.profile
        except Profile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=400)
        classroom_ids = Enrollment.objects.filter(student=user_profile).values_list('classroom_id', flat=True)
        # course_ids = Course.objects.filter(classrooms__id__in=classroom_ids).values_list('id', flat=True)
        assignments = Assignment.objects.filter(classroom_id__in=classroom_ids).distinct()
        serializer = self.get_serializer(assignments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='submitted')
    def submitted_assignments(self, request):
        user = request.user
        try:
            user_profile = user.profile
        except Profile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=400)
        assignment_ids = Submission.objects.filter(student=user_profile).values_list('assignment_id', flat=True)
        assignments = Assignment.objects.filter(id__in=assignment_ids)
        serializer = self.get_serializer(assignments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='my/classroom')
    def classroom_my_assignments(self, request):
        classroom_id = request.query_params.get('classroom_id')
        user = request.user
        try:
            user_profile = user.profile
        except Profile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=400)

        if not classroom_id:
            return Response({'error': 'classroom_id is required'}, status=400)

        now = timezone.now()

        assignments = Assignment.objects.filter(classroom_id=classroom_id)
        submitted_ids = Submission.objects.filter(
            student=user_profile, assignment__classroom_id=classroom_id).values_list('assignment_id', flat=True)

        closed = assignments.filter(close_at__lt=now)
        submitted = assignments.filter(id__in=submitted_ids)
        finished = (closed | submitted).distinct()

        available = assignments.filter(open_at__lte=now, close_at__gte=now)
        not_submitted = available.exclude(id__in=submitted_ids)

        return Response({
            'finished': AssignmentSerializer(finished, many=True).data,
            'not_submitted': AssignmentSerializer(not_submitted, many=True).data,
        })


class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer


class ProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]


class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='create')
    def create_article(self, request):
        classroom_id = request.query_params.get('classroom_id')
        if not classroom_id:
            return Response({'error': 'classroom_id is required'}, status=400)

        data = request.data.copy()
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        article = serializer.save()

        Classroom.objects.assign_article(
            classroom_id=classroom_id,
            article=article
        )

        classroom = Classroom.objects.get(id=classroom_id)
        classroom.articles.add(article)

        return Response(self.get_serializer(article).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='all')
    def all_articles(self, request):
        classroom_id = request.query_params.get('classroom_id')
        if not classroom_id:
            return Response({'error': 'classroom_id is required'}, status=400)

        existing_articles_ids = list(Article.objects.filter(classrooms=classroom_id).values_list('id', flat=True))

        articles = Article.objects.all()
        articles = articles.exclude(id__in=existing_articles_ids)
        serializer = self.get_serializer(articles, many=True)

        return Response(serializer.data)
