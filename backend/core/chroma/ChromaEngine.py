import os
import re
import time
from typing import Any, Dict, List, Union, Generator
import requests
import chromadb
from chromadb.utils import embedding_functions


class ChromaEngine:
    def drop(self):
        try:
            results = self.collection.get()
            all_ids = results.get("ids", [])
            if all_ids:
                self.collection.delete(ids=all_ids)
        except Exception as e:
            print(f"Error while dropping collection: {e}")
        
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
            name=self.collection_name, embedding_function=self.embed_model
        )

    def add_document(self, text: str, metadata: dict = None, doc_id: str = None):
        self.collection.add(
            documents=[text],
            metadatas=[metadata] if metadata else None,
            ids=[doc_id] if doc_id else None,
        )

    def search(self, query: str, k: int = 5, filters: dict = None) -> List[Dict]:
        results = self.collection.query(query_texts=[query], n_results=k, where=filters)
        return self._format_results(results)

    def get_by_id(self, doc_id: str) -> Union[Dict, None]:
        try:
            result = self.collection.get(ids=[doc_id])
            if not result["ids"]:
                return None
            return {
                "id": result["ids"][0],
                "document": result["documents"][0],
                "metadata": result["metadatas"][0] if result["metadatas"] else {},
            }
        except ValueError:
            return None

    def delete(self, doc_id: str):
        self.collection.delete(ids=[doc_id])

    def get_db_state(self) -> List[Dict[str, Any]]:
        try:
            results = self.collection.get()
            state = []
            for i in range(len(results["ids"])):
                state.append(
                    {
                        "id": results["ids"][i],
                        "document": results["documents"][i],
                        "metadata": (
                            results["metadatas"][i] if results["metadatas"] else {}
                        ),
                    }
                )
            return state
        except Exception:
            return []

    def _format_results(self, results: Dict) -> List[Dict]:
        formatted = []
        for i in range(len(results["ids"][0])):
            formatted.append(
                {
                    "id": results["ids"][0][i],
                    "document": results["documents"][0][i],
                    "metadata": (
                        results["metadatas"][0][i] if results["metadatas"] else {}
                    ),
                    "distance": results["distances"][0][i],
                }
            )
        return formatted


class QueryParser:
    @staticmethod
    def parse(query: str) -> Generator[Dict, None, None]:
        url = "http://haskell_api:8080/parse"  # имя сервиса из docker-compose
        print(f"Sending query to Haskell parser: {query.encode('utf-8')}")
        response = requests.post(url, data=query.encode("utf-8"))
        if response.status_code == 200:
            parsed = response.json()
            
            # Check if the response is an error object
            if isinstance(parsed, dict) and "error" in parsed:
                raise ValueError(parsed["error"])
            
            # Check if the response is a list of commands
            if not isinstance(parsed, list):
                raise ValueError(f"Haskell parse error: {response.text}")
            
            for command in parsed:
                yield command
        else:
            raise ValueError(f"Haskell parse error: {response.text}")
