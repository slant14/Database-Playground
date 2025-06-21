from engines.SQLEngine import SQLEngine
from engines.PostgresEngine import PostgresEngine


postgres_engine = PostgresEngine(host="postgres",user="dbpg", password="dbpg_pwd")

# TODO : add check_connection feature


__all__ = [
    "SQLEngine",
    "PostgresEngine",
    "postgres_engine",
]