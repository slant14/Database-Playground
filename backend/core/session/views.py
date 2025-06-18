from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Session
from .serializers import SessionSerializer


class SessionView(APIView):
    serializer_class = SessionSerializer
    queryset = Session.objects.all()

    def get(self, request: Request):
        session_id = request.COOKIES.get("session_id")

        if not session_id:
            session = Session.objects.create()
        else:
            session, _ = Session.objects.get_or_create(id=session_id)

        response = Response(self.serializer_class(session).data)
        response.set_cookie("session_id", str(session.id))

        return response
