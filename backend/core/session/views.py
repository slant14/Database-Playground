import uuid

from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.parsers import JSONParser

from engines import postgres_engine
from engines.shortcuts import db_exists

from .models import Session, SessionInfo
from .serializers import SessionSerializer, SessionInfoSerializer
from .docs import get_db_schema_info_doc, patch_session_info_doc
from .shortcuts import resolve_session_id


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
        session_id, err_response = resolve_session_id(request)
        if err_response:
            return err_response

        session = Session.objects.get(id=session_id)
        return Response(
            SessionInfoSerializer(
                SessionInfo.objects.get(session=session)).data)


    @patch_session_info_doc
    def patch(self, request: Request):
        session_id, err_response = resolve_session_id(request)
        if err_response:
            return err_response    

        try:
            session = Session.objects.get(id=session_id)
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
