from rest_framework import serializers

from .models import Classroom, Topic


class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classroom
        fields = "__all__"


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = "__all__"
