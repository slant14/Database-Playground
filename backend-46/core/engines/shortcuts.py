from . import DBEngine
from .exceptions import DBNotExists


def db_exists(engine: DBEngine, db_name: str) -> bool:
    try:
        engine.get_db(db_name)
        return True
    except DBNotExists:
        return False
