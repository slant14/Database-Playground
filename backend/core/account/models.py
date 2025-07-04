from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.base_user import BaseUserManager
from django.db.models.signals import post_save
from django.dispatch import receiver

class CustomUserManager(BaseUserManager):
    def create_user(self, #email,
                     password, **extra_fields):
        #if not email:
        #    raise ValueError(_('Email is not provided!'))
        #email = self.normalize_email(email)
        user = self.model(#email = email,
                           **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, #email,
                          password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must be set as staff'))

        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must be set as superuser'))

        return self.create_user(#email,
                                 password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    #email = models.EmailField(max_length = 255, unique = True)
    is_staff = models.BooleanField(default = False)
    is_active = models.BooleanField(default = True)
    is_superuser = models.BooleanField(default = False)
    created_date = models.DateTimeField(auto_now_add = True)
    updated_date = models.DateTimeField(auto_now = True)
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.USERNAME_FIELD

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    username = models.CharField(max_length = 250)
    avatar = models.ImageField(blank = True)
    school = models.CharField(blank = True, null = True)

    def __str__(self):
        return self.user.USERNAME_FIELD

@receiver(post_save, sender = User)
def save_user(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user = instance)
