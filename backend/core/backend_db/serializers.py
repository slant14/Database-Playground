from rest_framework import serializers
from .models import Classroom, Enrollment, Assignment, Submission, Article, Profile
from django.conf import settings
from django.contrib.auth import get_user_model
# from django.contrib.auth import authenticate

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = '__all__'

    def validate(self, data):
        name = data.get('name')
        email = data.get('email')
        if not name and not email:
            raise serializers.ValidationError("Name or email is required")
        return data

    def validate_name(self, value):
        if User.objects.filter(name=value).exists():
            raise serializers.ValidationError("User with this name already exists")
        return value

    def validate_email(self, value):
        if value is not None and User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email already exists")
        return value

    # def login(self, request):
    #    user = authenticate(request, name=request.data.get('name'), email=request.data.get('email'), password=request.data.get('password'))
    #    if user is not None:
    #        return user
    #    else:
    #        raise serializers.ValidationError("Invalid credentials")

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user


class ClassroomSerializer(serializers.ModelSerializer):
    TA_names = serializers.SerializerMethodField()
    primary_instructor_name = serializers.CharField(source='primary_instructor.user.name', read_only=True)
    # capacity = serializers.IntegerField(read_only=True)

    class Meta:
        model = Classroom
        fields = ['id', 'title', 'description', 'TA', 'primary_instructor',
                  'created_date', 'capacity', 'TA_names', 'primary_instructor_name', 'image']

    def get_TA_names(self, obj):
        return [ta.user.name for ta in obj.TA.all()]

# class TopicSerializer(serializers.ModelSerializer):
#    class Meta:
#        model = Topic
#        fields = '__all__'


class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.name', read_only=True)
    student_email = serializers.CharField(source='student.user.email', read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'student_name', 'student_email', 'classroom', 'grade', 'enrollment_date']
    def validate_grade(self, value):
        if value is not None:
            if value < 0.0 or value > 5.0:
                raise serializers.ValidationError("Grade must be between 0.0 and 5.0")
        return value

# class CourseSerializer(serializers.ModelSerializer):
#    class Meta:
#        model = Course
#        fields = '__all__'


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'


class SubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.name', read_only=True)
    student_email = serializers.CharField(source='student.user.email', read_only=True)

    class Meta:
        model = Submission
        fields = ['id', 'student', 'student_name', 'student_email', 'assignment', 'query', 'feedback', 'created_at']


class ArticleSerializer(serializers.ModelSerializer):
    author_names = serializers.SerializerMethodField()
    authors = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all(), many=True)

    class Meta:
        model = Article
        fields = ['id', 'title', 'authors', 'author_names', 'description', 'file']

    def get_author_names(self, obj):
        return [profile.user.name for profile in obj.authors.all()]


class ProfileSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_created_date = serializers.DateTimeField(source='user.created_date', read_only=True)

    gpa = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['id', 'user', 'user_name', 'user_email', 'school', 'avatar', 'description', 'user_created_date', 'gpa']

    def get_gpa(self, obj):
        return obj.gpa
