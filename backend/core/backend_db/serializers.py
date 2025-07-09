from rest_framework import serializers
from .models import Classroom, Enrollment, Course, Assignment, Submission, Topic
from django.conf import settings
from django.contrib.auth import get_user_model
#from django.contrib.auth import authenticate

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

    #def login(self, request):
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
    #capacity = serializers.IntegerField(read_only=True)
    class Meta:
        model = Classroom
        fields = ['id', 'title', 'description', 'TA', 'primary_instructor', 'topic', 'created_date', 'capacity', 'TA_names', 'primary_instructor_name']

    def get_TA_names(self, obj):
        return [ta.user.name for ta in obj.TA.all()]

    def validate_TA(self, value):
        for profile in value:
            if profile.user.role != 'ta':
                raise serializers.ValidationError(f"{profile.user.name} is not a TA")
        return value

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = '__all__'


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = '__all__' 