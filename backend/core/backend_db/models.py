# backend/school/models.py
from django.db import models
from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.base_user import BaseUserManager
from django.db.models.signals import post_save
from django.dispatch import receiver

class CustomUserManager(BaseUserManager):
    def create_user(self, name=None, email=None, password=None, **extra_fields):
        if not email and not name:
            raise ValueError(_('Email or name is not provided!'))
        email = self.normalize_email(email) if email else None
        user = self.model(name = name, email = email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


    def create_superuser(self, name=None, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must be set as staff'))

        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must be set as superuser'))

        return self.create_user(name, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        STUDENT = 'student', _('Student')
        TA = 'ta', _('Teaching Assistant')
        TEACHER = 'teacher', _('Teacher')
        ADMIN = 'admin', _('Admin')
    name = models.CharField(max_length = 255, unique = True, blank=True, null=True)
    email = models.EmailField(max_length = 255, unique = True, blank=True, null=True)
    is_staff = models.BooleanField(default = False)
    is_active = models.BooleanField(default = True)
    is_superuser = models.BooleanField(default = False)
    created_date = models.DateTimeField(auto_now_add = True)
    updated_date = models.DateTimeField(auto_now = True)
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.STUDENT,
    )
    USERNAME_FIELD = 'name'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.name

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    username = models.CharField(max_length = 250)
    avatar = models.ImageField(blank = True)
    school = models.CharField(blank = True, null = True)

    def __str__(self):
        return self.user.name

@receiver(post_save, sender = User)
def save_user(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user = instance)
        
class Topic(models.Model):
    title = models.CharField(max_length = 50)
    
    def __str__(self) -> str:
        return self.title

class Classroom(models.Model):
    title = models.CharField(max_length = 200)
    description = models.TextField()
    TA = models.ManyToManyField(Profile, related_name='ta_classrooms')
    primary_instructor = models.ForeignKey(to = Profile, on_delete = models.CASCADE)
    topic = models.ForeignKey(to = Topic, on_delete = models.DO_NOTHING, null = True)
    created_date = models.DateTimeField(auto_now_add = True)
    #capacity = models.IntegerField()

    def __str__(self) -> str:
        return self.title
    
    @property
    def capacity(self):
        return self.enrollments.count()

class Enrollment(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='enrollments')
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='enrollments')
    grade = models.FloatField(null=True, blank=True)
    enrollment_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'classroom')

    def __str__(self):
        return f"{self.student} in {self.classroom}"

class Course(models.Model):
    classrooms = models.ManyToManyField(Classroom, related_name='courses')
    title = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Assignment(models.Model):
    name = models.TextField()
    statement = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assignments')
    
    def __str__(self):
        return self.name

class Submission(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='submissions')
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    query = models.TextField()
    feedback = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'assignment')

    def __str__(self):
        return f"{self.student} - {self.assignment}"