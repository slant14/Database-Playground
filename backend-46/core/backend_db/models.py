# backend/school/models.py
from django.db import models
from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.base_user import BaseUserManager
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import MinValueValidator, MaxValueValidator


class CustomUserManager(BaseUserManager):
    def create_user(self, name=None, email=None, password=None, **extra_fields):
        if not email and not name:
            raise ValueError(_('Email or name is not provided!'))
        email = self.normalize_email(email) if email else None
        user = self.model(name=name, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        # Profile.objects.get_or_create(user=user)

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
        ADMIN = 'admin', _('Admin')
    name = models.CharField(max_length=255, unique=True, blank=True, null=True)
    email = models.EmailField(max_length=255, unique=True, blank=True, null=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
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
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(blank=True, upload_to='profile_images')
    school = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    @property
    def gpa(self):
        enrollments = self.enrollments.all()
        student_enrollments = [
            e for e in enrollments
            if not e.classroom.TA.filter(id=self.id).exists()
            and e.classroom.primary_instructor_id != self.id
        ]
        grades = [e.grade for e in student_enrollments if e.grade is not None]
        if not grades:
            return 0.0
        return sum(grades) / len(grades)

    def __str__(self):
        return self.user.name


@receiver(post_save, sender=User)
def save_user(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

# class Topic(models.Model):
#    title = models.CharField(max_length = 50)
#
#    def __str__(self) -> str:
#        return self.title


class Article(models.Model):
    title = models.TextField()
    authors = models.ManyToManyField(Profile, related_name='articles')
    description = models.TextField()
    file = models.FileField(blank=True, upload_to='article_images')
    created_date = models.DateTimeField(auto_now_add=True)
    # classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='articles')

    def __str__(self):
        return self.title


class Classroom(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='classroom_images/', null=True, blank=True)
    TA = models.ManyToManyField(Profile, related_name='ta_classrooms')
    primary_instructor = models.ForeignKey(to=Profile, on_delete=models.CASCADE, related_name='primary_classrooms')
    # topic = models.ForeignKey(to = Topic, on_delete = models.DO_NOTHING, null = True)
    created_date = models.DateTimeField(auto_now_add=True)
    articles = models.ManyToManyField(Article, blank=True, related_name='classrooms')
    image = models.ImageField(blank=True, upload_to='classroom_images')
    # capacity = models.IntegerField()

    def __str__(self) -> str:
        return self.title

    @property
    def capacity(self):
        return max(self.enrollments.count() - self.TA.count() - 1, 0)


class Enrollment(models.Model):
    student = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='enrollments')
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='enrollments')
    grade = models.FloatField(
        null=True, 
        blank=True,
        validators=[
            MinValueValidator(0.5, message='Grade cannot be less than 0.5'),
            MaxValueValidator(5.0, message='Grade cannot be greater than 5.0')
        ]
    )

    enrollment_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'classroom')

    def __str__(self):
        return f"{self.student} in {self.classroom}"

# class Course(models.Model):
#    classrooms = models.ManyToManyField(Classroom, related_name='courses')
#    title = models.TextField()
#   created_at = models.DateTimeField(auto_now_add=True)
#
#    def __str__(self):
#        return self.title


class Assignment(models.Model):
    title = models.TextField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='assignments')
    open_at = models.DateTimeField()
    close_at = models.DateTimeField()

    def __str__(self):
        return self.title


class Submission(models.Model):
    student = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='submissions')
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    query = models.TextField()
    feedback = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'assignment')

    def __str__(self):
        return f"{self.student} - {self.assignment}"
