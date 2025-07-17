from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import BaseParser

from engines import postgres_engine
from engines import mongo_engine
from chroma.ChromaClient import chroma_client
from engines.exceptions import QueryError
from engines.shortcuts import db_exists
from rest_framework.permissions import AllowAny, IsAuthenticated
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

        data = json.loads(request.body)
        user_id = request.user.id
        query_text = data.get("code", "")
        dump_text = data.get("dump", "")
        
        if action == 'state':
            print("Chroma state requested")
            return self.chroma_state(user_id)
        elif action == 'dump':
            try:
                dump_response = chroma_client.get_creation_dump(user_id)
                return Response(dump_response)
            except Exception as e:
                return Response({"error": str(e)}, status=500)
        elif action == 'query':
            return self.chroma_query(query_text, user_id)
        else: # Action == 'put'
            dump_text = "DROP; " + dump_text
            print("Chroma put action requested with query: ", dump_text)
            return self.chroma_query(dump_text, user_id)
    
    def chroma_query(self, query_text, user_id):
        if not query_text:
            return Response({"error": "Missing query"}, status=400)
        
        #print(f"Received query: {query_text}")
        
        try:
            start_time = time.time()
            response = chroma_client.query_parser(user_id, query_text)
            response.raise_for_status()
            result = response.json()
            
            db_state_response = chroma_client.get_db_state(user_id)
            db_state = db_state_response.get("state", [])
            print(result)
            execution_time = time.time() - start_time
            
            # Handle multiple results from the new API format
            if "results" in result:
                results = result["results"]
                
                # Check if there's a parse error
                if len(results) == 1 and results[0].get("command") == "PARSE_ERROR":
                    # Single parse error
                    error_result = results[0]
                    formatted_response = {
                        "command": query_text,
                        "result": error_result
                    }
                else:
                    # Multiple commands
                    formatted_commands = []
                    for i, cmd_result in enumerate(results):
                        formatted_commands.append({
                            "commandNumber": i + 1,
                            "command": f"Command {i + 1}",
                            "result": cmd_result
                        })
                    formatted_response = {
                        "commands": formatted_commands
                    }
                
                print({
                    **formatted_response,
                    "db_state": db_state,
                    "execution_time": f"{execution_time:.4f} seconds",
                    "documents_count": len(db_state)
                })

                return Response({
                    **formatted_response,
                    "db_state": db_state,
                    "execution_time": f"{execution_time:.4f} seconds",
                    "documents_count": len(db_state)
                })
            else:
                # Fallback for single result (backward compatibility)
                return Response({
                    "command": result.get("command", "UNKNOWN"),
                    "result": result.get("result", {}),
                    "db_state": db_state,
                    "execution_time": f"{execution_time:.4f} seconds",
                    "documents_count": len(db_state)
                })
        
        except Exception as e:
            return Response({"error": str(e)}, status=400)
            

    def chroma_state(self, user_id):
        if not user_id:
            return Response({"error": "Missing user_id"}, status=400)
        
        try:
            state_response = chroma_client.get_db_state(user_id)
            state = state_response.get("state", [])
            return Response(state_response)
        except Exception as e:
            return Response({"error": "User not found"})
        


class PlainTextParser(BaseParser):
    permission_classes=[IsAuthenticated]
    media_type = 'text/plain'
    def parse(self, stream, media_type=None, parser_context=None):
        return stream.read().decode('utf-8')


class PutView(APIView):
    permission_classes=[IsAuthenticated]
    @put_db_schema_doc
    def put(self, request: Request):
        try:
            data = json.loads(request.body)
            #print (f"PutView: Received data: {data}")
            user_id = request.user.id
            db_name = f"db_{user_id}"
            
            # Получаем dump из запроса
            dump = data.get("dump", "")
            #print(f"RECEIVED DUMP: {dump}")
            #print(f"DUMP TYPE: {type(dump)}")
            #print(f"DUMP LENGTH: {len(dump) if dump else 'None'}")
                
            
            #print(f"FINAL DUMP: {dump}")
            #print(f"PutView: user_id={user_id}, db_name={db_name}, data={data}")

            engine = get_db_engine(data.get("type"))
            print(f"Using engine: {engine}")
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
            print(f"SchemaView: user_id={user_id}")
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
        
