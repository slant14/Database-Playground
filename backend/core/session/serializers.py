import uuid
from rest_framework import serializers

from .models import Session


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