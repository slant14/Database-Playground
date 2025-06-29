from django.db import models
from django.utils import timezone


class DBSchema(models.Model):
    author = models.CharField(max_length=20)
    title = models.CharField(max_length=30)
    type = models.CharField(max_length=10)
    created = models.DateField(default=timezone.now())
    schema_description = models.TextField()
