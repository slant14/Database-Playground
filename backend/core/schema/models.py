from django.db import models

class DBSchema(models.Model):
    author = models.CharField(max_length=20)
    title = models.CharField(max_length=30)
    type = models.CharField(max_length=10)
    schema_description = models.TextField()


