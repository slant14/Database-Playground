import requests
import json
from typing import Dict, List, Any, Optional

class ChromaClient:
    
    def __init__(self, base_url: str = "http://chroma:9000"):
        self.base_url = base_url
    
    def add_document(self, user_id: int, text: str, metadata: Dict = None, doc_id: str = None) -> Dict:
        data = {
            "user_id": user_id,
            "text": text,
            "metadata": metadata,
            "doc_id": doc_id
        }
        response = requests.post(f"{self.base_url}/add_document", json=data)
        return response.json()
    
    def search(self, user_id: int, query: str, k: int = 5, filters: Dict = None) -> Dict:
        data = {
            "user_id": user_id,
            "query": query,
            "k": k,
            "filters": filters
        }
        response = requests.post(f"{self.base_url}/search", json=data)
        return response.json()
    
    def get_document(self, user_id: int, doc_id: str) -> Dict:
        data = {
            "user_id": user_id,
            "doc_id": doc_id
        }
        response = requests.post(f"{self.base_url}/get_document", json=data)
        return response.json()
    
    def delete_document(self, user_id: int, doc_id: str) -> Dict:
        data = {
            "user_id": user_id,
            "doc_id": doc_id
        }
        response = requests.post(f"{self.base_url}/delete_document", json=data)
        return response.json()
    
    def get_db_state(self, user_id: int) -> Dict:
        data = {"user_id": user_id}
        response = requests.post(f"{self.base_url}/get_db_state", json=data)
        return response.json()
    
    def query_parser(self, user_id: int, code: str) -> Dict:
        data = {
            "user_id": user_id,
            "code": code
        }
        response = requests.post(f"{self.base_url}/query_parser", json=data)
        return response
    
    def health_check(self) -> Dict:
        response = requests.get(f"{self.base_url}/health")
        return response.json()
