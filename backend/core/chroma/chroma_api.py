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

class UpdateDocumentRequest(BaseModel):
    user_id: int
    doc_id: str
    text: Optional[str] = None
    metadata: Optional[Dict] = None

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

@app.post("/update_document")
async def update_document(request: UpdateDocumentRequest):
    try:
        engine = ChromaEngine(request.user_id)
        success = engine.update_document(
            doc_id=request.doc_id,
            text=request.text,
            metadata=request.metadata
        )
        if success:
            return {"status": "success", "message": "Document updated successfully"}
        else:
            raise HTTPException(status_code=404, detail="Document not found")
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
        parsed_commands = QueryParser.parse(request.code)
        engine = ChromaEngine(request.user_id)
        
        results = []
        
        for parsed in parsed_commands:
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
                search_results = engine.search(
                    query=parsed["query"],
                    k=parsed.get("k", 2),
                    filters=parsed.get("filters")
                )
                result = {"command": "SEARCH", "result": {"search_results": search_results}}
            
            elif command == "GET":
                doc = engine.get_by_id(parsed["doc_id"])
                if doc is None:
                    result = {"command": "GET", "error": "Document not found"}
                else:
                    result = {"command": "GET", "result": {"status": "found", "document": doc}}
            
            elif command == "DELETE":
                doc = engine.get_by_id(parsed["doc_id"])
                if doc is None:
                    result = {"command": "DELETE", "error": "Document not found"}
                else:
                    engine.delete(parsed["doc_id"])
                    result = {"command": "DELETE", "status": "deleted"}
            
            elif command == "UPDATE":
                doc_id = parsed["doc_id"]
                text = parsed["text"]
                metadata = parsed["metadata"]
                
                if not doc_id:
                    result = {"command": "UPDATE", "error": "Document ID is required for update"}
                else:
                    existing_doc = engine.get_by_id(doc_id)
                    if existing_doc is None:
                        result = {"command": "UPDATE", "error": "Document not found"}
                    else:
                        engine.update_document(doc_id=doc_id, text=text, metadata=metadata)
                        result = {"command": "UPDATE", "doc_id": doc_id, "status": "updated"}
            
            elif command == "DROP":
                engine.drop_collection()
                result = {"command": "DROP", "status": "collection dropped"}
            
            else:
                result = {"command": command, "error": "Unknown command"}
            
            results.append(result)
        
        return {"results": results}
    
    except ValueError as ve:
        # Return parse error in a format that frontend can handle
        return {"results": [{"command": "PARSE_ERROR", "error": str(ve)}]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9000)
