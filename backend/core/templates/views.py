from rest_framework import mixins
from rest_framework import generics
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.parsers import JSONParser

from session.models import Session
from engines import postgres_engine

from .docs import post_template_schema
from .models import Template
from .serializers import TemplateSerializer, MinTemplateSerializer


class TemplateListCreateView(mixins.ListModelMixin,
                             generics.GenericAPIView):
    queryset = Template.objects.all()
    serializer_class = MinTemplateSerializer

    def get(self, request: Request):
        return self.list(request)

    @post_template_schema
    def post(self, request: Request):
        query_session_id = request.query_params.get("session_id")
        cookie_session_id = request.COOKIES.get("session_id")

        if not query_session_id:
            return Response({"detail": "Missing query session_id."}, status=400)
        if not cookie_session_id:
            return Response({"detail": "Missing cookie session_id."}, status=401)
        if query_session_id != cookie_session_id:
            return Response({"detail": "Session ID mismatch."}, status=401)
        
        session = Session.objects.get(id=query_session_id)

        data = JSONParser().parse(request)
        data['dump'] = postgres_engine.get_dump(session.get_unauth_dbname())
        
        serializer = TemplateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data)


class TemplateRetreiveView(mixins.RetrieveModelMixin,
                   generics.GenericAPIView):
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer

    def get(self, request: Request, pk: int):
        return self.retrieve(request, pk)
