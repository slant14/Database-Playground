from contextlib import contextmanager

from core.engines import PostgresEngine


@contextmanager
def postgres_tmp_db(engine: PostgresEngine, db_name: str, dump: str):
    try:
        engine.create_db(db_name, dump)
        yield
    finally:
        engine.drop_db(db_name)
