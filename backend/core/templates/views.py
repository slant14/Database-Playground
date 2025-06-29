from rest_framework import generics, mixins
from rest_framework.parsers import JSONParser
from rest_framework.request import Request
from rest_framework.response import Response

from engines import postgres_engine
from session.models import Session
from session.shortcuts import resolve_session_id

from .docs import post_template_schema
from .models import Template
from .serializers import MinTemplateSerializer, TemplateSerializer


class TemplateListCreateView(mixins.ListModelMixin,
                             generics.GenericAPIView):
    queryset = Template.objects.all()
    serializer_class = MinTemplateSerializer

    def get(self, request: Request):
        return self.list(request)

    @post_template_schema
    def post(self, request: Request):
        session_id, err_response = resolve_session_id(request)
        if err_response:
            return err_response

        session = Session.objects.get(id=session_id)
        db_name = session.get_unauth_dbname()

        data = JSONParser().parse(request)
        data['dump'] = postgres_engine.get_dump(db_name)

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
