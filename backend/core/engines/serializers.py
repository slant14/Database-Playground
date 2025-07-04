from rest_framework import serializers
from .models import MongoQueryResult

class MongoQueryResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = MongoQueryResult
        fields = ['query', 'data', 'execution_time']

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if representation['data'] is None:
            representation['data'] = None
        elif isinstance(representation['data'], (list, dict)):
            pass
        else:
            representation['data'] = str(representation['data'])

        return representation
