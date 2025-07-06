from django.db import models

from account.models import Profile


class Topic(models.Model):
    title = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.title


class Classroom(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    teacher = models.ForeignKey(to=Profile, on_delete=models.CASCADE)
    topic = models.ForeignKey(to=Topic, on_delete=models.DO_NOTHING, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    capacity = models.IntegerField()

    def __str__(self) -> str:
        return self.title
