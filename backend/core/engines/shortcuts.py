from . import SQLEngine
from .exceptions import DBNotExists


def db_exists(engine: SQLEngine, db_name: str) -> bool:
    try:
        engine.get_db(db_name)
        return True
    except DBNotExists:
        return False
