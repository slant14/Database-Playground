from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
from ChromaEngine import ChromaEngine, QueryParser
import uvicorn
import time

app = FastAPI(title="ChromaEngine API", version="1.0.0")

class AddDocumentRequest(BaseModel):
    user_id: int
    text: str
    metadata: Optional[Dict] = None
    doc_id: Optional[str] = None

class SearchRequest(BaseModel):
    user_id: int
    query: str
    k: int = 2
    filters: Optional[Dict] = None

class GetDocumentRequest(BaseModel):
    user_id: int
    doc_id: str

class DeleteDocumentRequest(BaseModel):
    user_id: int
    doc_id: str

class QueryParseRequest(BaseModel):
    user_id: int
    code: str

@app.post("/add_document")
async def add_document(request: AddDocumentRequest):
    try:
        engine = ChromaEngine(request.user_id)
        engine.add_document(
            text=request.text,
            metadata=request.metadata,
            doc_id=request.doc_id
        )
        return {"status": "success", "message": "Document added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search")
async def search_documents(request: SearchRequest):
    try:
        engine = ChromaEngine(request.user_id)
        results = engine.search(
            query=request.query,
            k=request.k,
            filters=request.filters
        )
        return {"status": "success", "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/get_document")
async def get_document(request: GetDocumentRequest):
    try:
        engine = ChromaEngine(request.user_id)
        result = engine.get_by_id(request.doc_id)
        if result is None:
            raise HTTPException(status_code=404, detail="Document not found")
        return {"status": "success", "document": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/delete_document")
async def delete_document(request: DeleteDocumentRequest):
    try:
        engine = ChromaEngine(request.user_id)
        engine.delete(request.doc_id)
        return {"status": "success", "message": "Document deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/get_db_state")
async def get_db_state(request: dict):
    try:
        user_id = request.get("user_id")
        if not user_id:
            raise HTTPException(status_code=400, detail="user_id is required")
        
        engine = ChromaEngine(user_id)
        state = engine.get_db_state()
        return {"state": state}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query_parser")
async def query_parser(request: QueryParseRequest):
    try:
        parsed = QueryParser.parse(request.code)
        engine = ChromaEngine(request.user_id)
        
        command = parsed["command"]
        result = {}
        
        if command == "ADD":
            doc_id = parsed.get("doc_id") or f"doc_{int(time.time() * 1000)}"
            engine.add_document(
                text=parsed["text"],
                metadata=parsed.get("metadata"),
                doc_id=doc_id
            )
            result = {"command": "ADD", "doc_id": doc_id, "status": "added"}
        
        elif command == "SEARCH":
            results = engine.search(
                query=parsed["query"],
                k=parsed.get("k", 2),
                filters=parsed.get("filters")
            )
            result = {"command": "SEARCH", "result": {"search_results": results}}
        
        elif command == "GET":
            doc = engine.get_by_id(parsed["doc_id"])
            if doc is None:
                raise HTTPException(status_code=404, detail="Document not found")
            else:
                result = {"command": "GET", "result": {"status": "found", "document": doc}}
        
        elif command == "DELETE":
            doc = engine.get_by_id(parsed["doc_id"])
            if doc is None:
                raise HTTPException(status_code=404, detail="Document not found")
            engine.delete(parsed["doc_id"])
            result = {"command": "DELETE", "status": "deleted"}
        
        else:
            raise HTTPException(status_code=400, detail="Unknown command")
        
        return result
    
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9000)
