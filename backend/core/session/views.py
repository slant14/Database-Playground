from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response

import uuid

from .models import Session
from .serializers import SessionSerializer

from engines import postgres_engine
from engines.shortcuts import db_exists


class SessionView(APIView):
    serializer_class = SessionSerializer
    queryset = Session.objects.all()

    def get(self, request: Request):
        session_id = request.COOKIES.get("session_id")

        if not session_id:
            session = Session.objects.create()
        else:
            session, _ = Session.objects.get_or_create(id=uuid.UUID(session_id))

        db_name = session.get_unauth_dbname()
        if not db_exists(postgres_engine, db_name):
            postgres_engine.create_db(db_name, "")

        response = Response(self.serializer_class(session).data)
        response.set_cookie("session_id", session.id.hex)

        return response
