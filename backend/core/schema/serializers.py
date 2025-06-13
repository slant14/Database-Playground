from rest_framework import serializers

from .models import DBSchema

class DBSchemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DBSchema
        fields = '__all__'

