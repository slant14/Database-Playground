import uuid
from rest_framework import serializers

from .models import Session, SessionInfo


class SessionSerializer(serializers.ModelSerializer):
    session_id = serializers.SerializerMethodField()

    class Meta:
        model = Session
        fields = ['session_id']

    def get_session_id(self, obj):
        if isinstance(obj.id, uuid.UUID):
            return obj.id.hex
        else:
            return uuid.UUID(obj.id).hex


class HexUUIDField(serializers.PrimaryKeyRelatedField):
    def to_representation(self, value):
        if isinstance(value, uuid.UUID):
            return value.hex
        elif isinstance(value, str):
            return uuid.UUID(value).hex
        else:
            return uuid.UUID(str(value.pk)).hex


class SessionInfoSerializer(serializers.ModelSerializer):
    session = HexUUIDField(queryset=Session.objects.all())

    class Meta:
        model = SessionInfo
        fields = '__all__'