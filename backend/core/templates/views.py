from rest_framework import generics, mixins
from rest_framework.parsers import JSONParser
from rest_framework.request import Request
from rest_framework.response import Response

from engines import postgres_engine, mongo_engine
from db.shortcuts import get_db_engine
from chroma.ChromaClient import chroma_client
from session.models import Session
from session.shortcuts import resolve_session_id
from rest_framework.permissions import IsAuthenticated
from .docs import post_template_schema
from .models import Template
from .serializers import MinTemplateSerializer, TemplateSerializer


class TemplateListCreateView(mixins.ListModelMixin,
                             mixins.DestroyModelMixin,
                             generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Template.objects.all()
    serializer_class = MinTemplateSerializer

    def get(self, request: Request):
        #print("TemplateListCreateView GET request")
        return self.list(request)

    def delete(self, request: Request, pk: int):
        """Delete a template by ID"""
        try:
            template = Template.objects.get(id=pk)
            template.delete()
            return Response({"detail": "Template deleted successfully"}, status=200)
        except Template.DoesNotExist:
            return Response({"detail": "Template not found"}, status=404)
        except Exception as e:
            return Response({"detail": f"Error deleting template: {str(e)}"}, status=500)

    @post_template_schema
    def post(self, request: Request):
        user_id = request.user.id if request.user.is_authenticated else None
        db_name = f"db_{user_id}"
        print(f"Creating template for user {user_id} with db name {db_name}")

        data = JSONParser().parse(request)
        print(f"Template data received: {data}")
        
        try:
            if data["type"] == "CHRM":
                dump = chroma_client.get_creation_dump(user_id)
                data['dump'] = dump['dump']
            else:
                engine = get_db_engine(data.get("type"))
                print(f"Using engine: {engine}")
                if not engine:
                    return Response({"detail": "Unsupported database type"}, status=400)
                dump = engine.get_dump(db_name)
                print(f"Database dump retrieved successfully, length: {len(dump) if dump else 'None'}")
                data['dump'] = dump
        except Exception as e:
            print(f"Error getting database dump: {e}")
            # Используем dump из запроса, если не удалось получить из БД
            if 'dump' not in data or not data['dump']:
                data['dump'] = "-- No database dump available"
            print(f"Using fallback dump: {data['dump'][:100]}...")

        serializer = TemplateSerializer(data=data)
        #print(serializer)
        if not serializer.is_valid():
            print(f"Template serializer validation errors: {serializer.errors}")
        serializer.is_valid(raise_exception=True)
        serializer.save()

        print(serializer.data)
        return Response(serializer.data)


class TemplateRetreiveView(mixins.RetrieveModelMixin,
                           generics.GenericAPIView):
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer

    def get(self, request: Request, pk: int):
        return self.retrieve(request, pk)
