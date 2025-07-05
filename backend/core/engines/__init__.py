from decouple import config
from .SQLEngine import SQLEngine
from .PostgresEngine import PostgresEngine

postgres_engine = PostgresEngine(
                root_db="",
                host="postgres",
                port=5432,
                user="my_pg_user",
                password="my_pg_password",
            )

__all__ = [
    "SQLEngine",
    "PostgresEngine",
    "postgres_engine",
]