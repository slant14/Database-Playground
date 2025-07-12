from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import BaseParser

from engines import postgres_engine
from engines import mongo_engine
from engines.exceptions import QueryError
from engines.shortcuts import db_exists
from rest_framework.permissions import IsAuthenticated, AllowAny
from db.shortcuts import get_db_engine

from chroma.ChromaClient import ChromaClient
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import time
import traceback

import json

from .docs import (
    get_db_schema_doc, post_db_query_doc,
    put_db_schema_doc
)

@method_decorator(csrf_exempt, name='dispatch')
class ChromaQueryParser(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = json.loads(request.body)
        action = data.get('action')
        print(f"Chroma action: {action}")
        
        if action == 'state':
            return self.chroma_state(request)
        else:
            return self.chroma_query(request)
    
    def chroma_query(self, request):
        try:
            data = json.loads(request.body)
            query_text = data.get("code")
            user_id = request.user.id
        except Exception:
            query_text = None

        if not query_text:
            return Response({"error": "Missing query"}, status=400)
        
        print(f"Received query: {query_text}")
        
        try:
            start_time = time.time()
            chroma_client = ChromaClient()
            response = chroma_client.query_parser(user_id, query_text)
            response.raise_for_status()
            result = response.json()
            
            db_state_response = chroma_client.get_db_state(user_id)
            db_state = db_state_response.get("state", [])
            print(result)
            execution_time = time.time() - start_time
            
            return Response({
                "command": result.get("command", "UNKNOWN"),
                "result": result.get("result", {}),
                "db_state": db_state,
                "execution_time": f"{execution_time:.4f} seconds",
                "documents_count": len(db_state)
            })
        
        except Exception as e:
            return Response({"error": str(e)}, status=400)

    def chroma_state(self, request):
        print("Chroma state request received")
        try:
            data = json.loads(request.body)
            user_id = request.user.id
        except Exception:
            user_id = None
        if not user_id:
            return Response({"error": "Missing user_id"}, status=400)
        
        try:
            chroma_client = ChromaClient()
            state_response = chroma_client.get_db_state(user_id)
            state = state_response.get("state", [])
            return Response(state_response)
        except Exception as e:
            return Response({"error": "User not found"})
        


class PlainTextParser(BaseParser):
    permission_classes=[AllowAny]
    media_type = 'text/plain'
    def parse(self, stream, media_type=None, parser_context=None):
        return stream.read().decode('utf-8')


class PutView(APIView):
    permission_classes=[IsAuthenticated]
    @put_db_schema_doc
    def put(self, request: Request):
        try:
            data = json.loads(request.body)
            user_id = request.user.id
            db_name = f"db_{user_id}"
            
            # Получаем dump из запроса
            dump = data.get("dump")
            print(f"RECEIVED DUMP: {dump}")
            print(f"DUMP TYPE: {type(dump)}")
            print(f"DUMP LENGTH: {len(dump) if dump else 'None'}")
                
            
            print(f"FINAL DUMP: {dump}")
            print(f"PutView: user_id={user_id}, db_name={db_name}, data={data}")

            engine = get_db_engine(data.get("type"))
            if not engine:
                return Response({"detail": "Unsupported database type"}, status=400)

            if db_exists(engine, db_name):
                engine.drop_db(db_name)
                print(f"Dropped existing database for user {db_name}")
                
            print(f"Creating database for user {db_name}")
            
            engine.create_db(db_name, dump)

            try:
                schema = engine.get_db(db_name)
                print(f"DEBUG: Database '{db_name}' state after creation:")
                print(f"Schema: {schema}")
            except Exception as e:
                print(f"DEBUG: Error getting database state: {str(e)}")

            return Response({"detail": "Database was set up"}, status=214)
        except Exception as e:
            print(f"PutView error: {e}")
            traceback.print_exc()
            return Response({"detail": "Error creating database: " + str(e)}, status=500)


class SchemaView(APIView):
    permission_classes=[IsAuthenticated]
    @get_db_schema_doc
    def post(self, request: Request):
        try:
            data = json.loads(request.body)
            user_id = request.user.id
            db_name = f"db_{user_id}"

            engine = get_db_engine(data.get("type"))
            if not engine:
                return Response({"detail": "Unsupported database type"}, status=400)

            print(f"SchemaView: user_id={user_id}, db_name={db_name}, data={data}")
            if not db_exists(engine, db_name):
                print(f"Database {db_name} does not exist, returning 404")
                return Response({"detail": "Database does not exist. Please create it first."}, status=404)

            schema = engine.get_db(db_name)
            print(f"SchemaView: schema={schema}")

            return Response(schema.to_json())
        except Exception as e:
            print(f"SchemaView error: {e}")
            traceback.print_exc()
            return Response({"detail": "Error retrieving schema: " + str(e)}, status=400)


class QueryView(APIView):
    permission_classes=[IsAuthenticated]
    parser_classes = [PlainTextParser]

    @post_db_query_doc
    def post(self, request: Request):
        try:
            data = json.loads(request.body)
            user_id = request.user.id
            db_name = f"db_{user_id}"

            print(f"QueryView: user_id={user_id}, db_name={db_name}, data={data}")

            query = data.get("code")
            query = query.strip()
            query = query.replace('\\n', '')
            print(f"QueryView: Executing query: {query}")

            engine = get_db_engine(data.get("type"))
            if not engine:
                return Response({"detail": "Unsupported database type"}, status=400)
            
            if not isinstance(query, str):
                return Response({"detail": "Not a plain string query"}, status=400)
            
            if not db_exists(engine, db_name):
                return Response({"detail": "Database does not exist. Please create it first."}, status=400)
            
            results = engine.send_query(db_name, query)
            schema = engine.get_db(db_name)

            json_results = [r.to_json() for r in results]
            json_schema = schema.to_json()

            print(f"QueryView: Results: {json_results}")

            return Response({
                "results": json_results,
                "schema": json_schema
            })
        except QueryError as e:
            print(f"QueryView QueryError: {e}")
            return Response({"detail": "QueryError: "+str(e)}, status=400)
        except Exception as e:
            print(f"QueryView error: {e}")
            traceback.print_exc()
            return Response({"detail": "Error executing query: " + str(e)}, status=500)
        
