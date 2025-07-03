from engines import postgres_engine
from engines.exceptions import QueryError
from engines.shortcuts import db_exists
from rest_framework.parsers import BaseParser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from session.exceptions import ExceptionWithResponse
from session.models import Session, SessionInfo
from session.shortcuts import resolve_session_id

from .docs import get_db_schema_doc, post_db_query_doc, put_db_schema_doc


class PlainTextParser(BaseParser):
    media_type = "text/plain"

    def parse(self, stream, media_type=None, parser_context=None):
        return stream.read().decode("utf-8")


class PutView(APIView):
    @put_db_schema_doc
    def put(self, request: Request):
        session_id, err_response = resolve_session_id(request)
        if err_response:
            return err_response

        session_info = SessionInfo.objects.get(session=session_id)
        db_name = session_info.db_name

        if not session_info.template:
            return Response({"detail": "Template not chosen"}, status=400)

        if db_exists(postgres_engine, db_name):
            postgres_engine.drop_db(db_name)

        dump = session_info.template.dump
        postgres_engine.create_db(db_name, dump)

        return Response({"detail": "Database was set up"}, status=214)


class SchemaView(APIView):
    @get_db_schema_doc
    def get(self, request: Request):
        session_id, err_response = resolve_session_id(request)
        if err_response:
            return err_response

        session = Session.objects.get(id=session_id)
        db_name = session.get_unauth_dbname()
        schema = postgres_engine.get_db(db_name)

        return Response(schema.to_json())


class QueryView(APIView):

    parser_classes = [PlainTextParser]

    @post_db_query_doc
    def post(self, request: Request):
        session_id, err_response = resolve_session_id(request)
        if err_response:
            return err_response

        session = Session.objects.get(id=session_id)
        db_name = session.get_unauth_dbname()

        query = request.data
        query = query.strip()
        query = query.replace("\\n", "")
        print("\n\nDATA:", query, "\n\n")
        if not isinstance(query, str):
            return Response({"detail": "Not a plain string query"}, status=400)

        try:
            results = postgres_engine.send_query(db_name, query)
        except QueryError as e:
            return Response({"detail": "QueryError: " + str(e)}, status=400)

        schema = postgres_engine.get_db(db_name)

        json_results = [r.to_json() for r in results]
        json_schema = schema.to_json()

        return Response({"results": json_results, "schema": json_schema})
