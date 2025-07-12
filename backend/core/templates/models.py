from django.db import models


class DBType(models.TextChoices):
    POSTGRES = "PSQL"
    MYSQL = "MSQL"
    SQLITE = "SQLT"
    MONGODB = "MGDB"


class Template(models.Model):
    name = models.CharField(max_length=150, unique=True)
    author = models.CharField(max_length=20)
    type = models.CharField(choices=DBType)
    dump = models.TextField(blank=True, default="")
