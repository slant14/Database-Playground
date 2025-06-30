from contextlib import contextmanager

from core.engines import PostgresEngine, MongoEngine


@contextmanager
def postgres_tmp_db(engine: PostgresEngine, db_name: str, dump: str):
    try:
        engine.create_db(db_name, dump)
        yield

    finally:
        engine.drop_db(db_name)


@contextmanager
def mongo_tmp_db(engine: MongoEngine, db_name: str, dump: str):
    try:
        engine.create_db(db_name, dump)
        yield

    finally:
        engine.drop_db(db_name)
