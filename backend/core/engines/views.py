import json
from rest_framework.response import Response
from rest_framework.decorators import api_view
from engines.ChromaEngine import ChromaEngine, QueryParser
import time
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['POST'])
def chroma_query(request):
    try:
        data = json.loads(request.body)
        query_text = data.get("code")
        user_id = data.get("user_id")
    except Exception:
        query_text = None

    if not query_text:
        return Response({"error": "Missing query"}, status=400)
    
    print(f"Received query: {query_text}")
    
    try:
        start_time = time.time()
        
        parsed = QueryParser.parse(query_text)
        
        engine = ChromaEngine(user_id)
        
        command = parsed["command"]
        result = {}
        
        if command == "ADD":
            doc_id = parsed.get("doc_id") or f"doc_{int(time.time() * 1000)}"
            engine.add_document(
                text=parsed["text"],
                metadata=parsed.get("metadata"),
                doc_id=doc_id
            )
            result = {"status": "added", "doc_id": doc_id}
        
        elif command == "SEARCH":
            search_results = engine.search(
                query=parsed["query"],
                k=parsed["k"],
                filters=parsed.get("filters")
            )
            result = {"search_results": search_results}
        
        elif command == "GET":
            doc = engine.get_by_id(parsed["doc_id"])
            result = {"document": doc} if doc else {"error": "Document not found"}
        
        elif command == "DELETE":
            engine.delete(parsed["doc_id"])
            result = {"status": "deleted", "doc_id": parsed["doc_id"]}
        
        db_state = engine.get_db_state()
        execution_time = time.time() - start_time
        
        return Response({
            "command": command,
            "result": result,
            "db_state": db_state,
            "execution_time": f"{execution_time:.4f} seconds",
            "documents_count": len(db_state)
        })
    
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@csrf_exempt
@api_view(['GET'])  
def chroma_state(request):
    try:
        data = json.loads(request.body)
        user_id = data.get("user_id")
    except Exception:
        user_id = None
    if not user_id:
        return Response({"error": "Missing user_id"}, status=400)
    
    engine = ChromaEngine(user_id)
    try:
        state = engine.get_db_state()
        return Response({"state": state})
    except Exception as e:
        return Response({"error": str(e)}, status=400)