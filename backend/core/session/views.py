from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response

from .models import Session, SessionInfo
from .serializers import SessionSerializer, SessionInfoSerializer

from engines import postgres_engine
from engines.shortcuts import db_exists

from .docs import get_db_schema_info_doc, patch_session_info_doc

import uuid
from rest_framework.parsers import JSONParser


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

class SessionInfoView(APIView):

    @get_db_schema_info_doc
    def get(self, request: Request):
        query_session_id = request.query_params.get("session_id")
        cookie_session_id = request.COOKIES.get("session_id")

        if not query_session_id:
            return Response({"detail": "Missing query session_id."}, status=400)
        if not cookie_session_id:
            return Response({"detail": "Missing cookie session_id."}, status=401)
        if query_session_id != cookie_session_id:
            return Response({"detail": "Session ID mismatch."}, status=401)

        session = Session.objects.get(id=query_session_id)
        return Response(SessionInfoSerializer(SessionInfo.objects.get(session=session)).data)


    @patch_session_info_doc
    def patch(self, request: Request):
        query_session_id = request.query_params.get("session_id")
        cookie_session_id = request.COOKIES.get("session_id")

        if not query_session_id:
            return Response({"detail": "Missing query session_id."}, status=400)
        if not cookie_session_id:
            return Response({"detail": "Missing cookie session_id."}, status=401)
        if query_session_id != cookie_session_id:
            return Response({"detail": "Session ID mismatch."}, status=401)

        try:
            session = Session.objects.get(id=query_session_id)
            session_info = SessionInfo.objects.get(session=session)
        except Session.DoesNotExist:
            return Response({"detail": "Session not found."}, status=404)
        except SessionInfo.DoesNotExist:
            return Response({"detail": "SessionInfo not found."}, status=404)

        data = JSONParser().parse(request)
        serializer = SessionInfoSerializer(session_info, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


