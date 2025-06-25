import time
import chromadb
from chromadb.utils import embedding_functions
from typing import List, Dict, Union, Any
import os
import re

class ChromaEngine:
    def __init__(self, user_id: int, persist_dir: str = "playground/chroma_persist"):
        self.user_id = user_id
        self.persist_dir = persist_dir
        self.collection_name = f"user_{user_id}_collection"
        
        user_dir = os.path.join(persist_dir, str(user_id))
        os.makedirs(user_dir, exist_ok=True)
        
        self.client = chromadb.PersistentClient(path=user_dir)
        
        self.embed_model = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            embedding_function=self.embed_model
        )

    def add_document(self, text: str, metadata: dict = None, doc_id: str = None):
        self.collection.add(
            documents=[text],
            metadatas=[metadata] if metadata else None,
            ids=[doc_id] if doc_id else None
        )

    def search(
        self, 
        query: str, 
        k: int = 5, 
        filters: dict = None
    ) -> List[Dict]:
        results = self.collection.query(
            query_texts=[query],
            n_results=k,
            where=filters
        )
        return self._format_results(results)

    def get_by_id(self, doc_id: str) -> Union[Dict, None]:
        try:
            result = self.collection.get(ids=[doc_id])
            if not result['ids']:
                return None
            return {
                "id": result['ids'][0],
                "document": result['documents'][0],
                "metadata": result['metadatas'][0] if result['metadatas'] else {}
            }
        except ValueError:
            return None

    def delete(self, doc_id: str):
        self.collection.delete(ids=[doc_id])
    
    def get_db_state(self) -> List[Dict[str, Any]]:
        try:
            results = self.collection.get()
            state = []
            for i in range(len(results['ids'])):
                state.append({
                    "id": results['ids'][i],
                    "document": results['documents'][i],
                    "metadata": results['metadatas'][i] if results['metadatas'] else {}
                })
            return state
        except Exception:
            return []

    def _format_results(self, results: Dict) -> List[Dict]:
        formatted = []
        for i in range(len(results['ids'][0])):
            formatted.append({
                "id": results['ids'][0][i],
                "document": results['documents'][0][i],
                "metadata": results['metadatas'][0][i] if results['metadatas'] else {},
                "distance": results['distances'][0][i]
            })
        return formatted
    

class QueryParser:
    @staticmethod
    def parse(query: str) -> dict:
        query = query.strip()
        if not query:
            raise ValueError("Empty query")
            
        command = query.split()[0].upper()
        
        if command == "ADD":
            return QueryParser._parse_add(query)
        elif command == "SEARCH":
            return QueryParser._parse_search(query)
        elif command == "GET":
            return QueryParser._parse_get(query)
        elif command == "DELETE":
            return QueryParser._parse_delete(query)
        else:
            raise ValueError(f"Unknown command: {command}")

    @staticmethod
    def _parse_add(query: str) -> dict:
        parts = query.split(maxsplit=1)
        if len(parts) < 2:
            raise ValueError("Invalid ADD format")
        
        text, metadata = QueryParser._extract_metadata(parts[1])
        return {
            "command": "ADD",
            "text": text,
            "metadata": metadata
        }

    @staticmethod
    def _parse_search(query: str) -> dict:
        parts = query.split(maxsplit=1)
        if len(parts) < 2:
            raise ValueError("Invalid SEARCH format")
        
        k = 2
        filters = {}
        
        text, params = QueryParser._extract_params(parts[1])
        
        if 'k' in params:
            try:
                k = int(params['k'])
            except ValueError:
                raise ValueError("k must be integer")
                
        if 'filters' in params:
            filters = QueryParser._parse_filters(params['filters'])
        
        return {
            "command": "SEARCH",
            "query": text,
            "k": k,
            "filters": filters
        }

    @staticmethod
    def _parse_get(query: str) -> dict:
        parts = query.split(maxsplit=1)
        if len(parts) < 2:
            raise ValueError("Invalid GET format")
        
        params = QueryParser._parse_key_value(parts[1])
        if 'id' not in params:
            raise ValueError("Missing 'id' in GET command")
        
        return {
            "command": "GET",
            "doc_id": params['id']
        }

    @staticmethod
    def _parse_delete(query: str) -> dict:
        parts = query.split(maxsplit=1)
        if len(parts) < 2:
            raise ValueError("Invalid DELETE format")
        
        params = QueryParser._parse_key_value(parts[1])
        if 'id' not in params:
            raise ValueError("Missing 'id' in DELETE command")
        
        return {
            "command": "DELETE",
            "doc_id": params['id']
        }
    
    @staticmethod
    def _extract_metadata(text: str) -> tuple:
        if "metadata:" not in text:
            return text, {}
        
        text_part, meta_part = text.split("metadata:", 1)
        return text_part.strip(), QueryParser._parse_filters(meta_part)

    @staticmethod
    def _extract_params(text: str) -> tuple:
        param_pattern = re.compile(r'(\w+)\s*[:=]\s*([^\s]+)')
        params = {}
        matches = list(param_pattern.finditer(text))
        if matches:
            first_param_start = matches[0].start()
            text_part = text[:first_param_start].strip()
            for m in matches:
                params[m.group(1)] = m.group(2)
        else:
            text_part = text.strip()
        return text_part, params

    @staticmethod
    def _parse_filters(filters_str: str) -> dict:
        return {
            k.strip(): v.strip()
            for item in filters_str.split(";")
            if "=" in item
            for k, v in [item.split("=", 1)]
        }

    @staticmethod
    def _parse_key_value(options: str) -> dict:
        return {
            k.strip(): v.strip()
            for item in options.split()
            if "=" in item
            for k, v in [item.split("=", 1)]
        }