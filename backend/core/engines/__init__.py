from .PostgresEngine import PostgresEngine
from .MongoEngine import MongoEngine
from .DBEngine import DBEngine


postgres_engine = PostgresEngine(
    user="dbpg",
    password="dbpg_pwd",
    host="postgres",
)

mongo_engine = MongoEngine(
    user="dbpg",
    password="dbpg_pwd",
    host="mongodb",
)


__all__ = [
    "DBEngine",
    "PostgresEngine",
    "MongoEngine",
    "postgres_engine",
    "mongo_engine",
]
