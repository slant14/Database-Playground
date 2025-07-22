from rest_framework import status, viewsets

from schema.models import DBSchema

from .serializers import DBSchemaSerializer


class DBSchemaModelViewSet(viewsets.ModelViewSet):
    queryset = DBSchema.objects.all()
    serializer_class = DBSchemaSerializer
    permission_classes = []
