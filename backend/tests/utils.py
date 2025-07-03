import os
from contextlib import contextmanager

import pytest

from core.engines import MongoEngine, PostgresEngine

INTEGRATION_TEST = os.environ.get("INTEGRATION_TEST", False)


def integration_test(func):
    """ Decorator function

    Skips the test if INTEGRATION_TEST
    env variable is unset or equals False
    """
    return pytest.mark.skipif(
        (not INTEGRATION_TEST),
        reason="INTEGRATION_TEST=false"
    )(func)


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


def remove_mongo_ids(data: dict | list):
    """ Removes all 'id' keys from dict \\
    Needed for easier integration testing
    """
    if isinstance(data, list):
        return [remove_mongo_ids(i) for i in data]

    if isinstance(data, dict):
        if "_id" in data:
            del data["_id"]
        if "inserted_id" in data:
            del data["inserted_id"]
        if "inserted_ids" in data:
            del data["inserted_ids"]

    return data
