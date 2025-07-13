import os
from .DBEngine import DBEngine
from .MongoEngine import MongoEngine
from .PostgresEngine import PostgresEngine

postgres_engine = PostgresEngine(
    user=os.environ.get("POSTGRES_USER", "dbpg"),
    password=os.environ.get("POSTGRES_PASSWORD", "dbpg_pwd"),
    host="postgres",
)

mongo_engine = MongoEngine(
    user=os.environ.get("MONGO_USER", "dbpg"),
    password=os.environ.get("MONGO_PASSWORD", "dbpg_pwd"),
    host="mongodb",
)


__all__ = [
    "DBEngine",
    "PostgresEngine",
    "MongoEngine",
    "postgres_engine",
    "mongo_engine",
]
