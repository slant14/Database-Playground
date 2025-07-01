from .PostgresEngine import PostgresEngine
from .SQLEngine import SQLEngine


postgres_engine = PostgresEngine(
    user="dbpg",
    password="dbpg_pwd",
    host="postgres",
)


__all__ = [
    "SQLEngine",
    "PostgresEngine",
    "postgres_engine",
]
