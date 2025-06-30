import pytest

from core.engines import MongoEngine
from core.engines.exceptions import (
    DBNotExists, DBExists
)

from tests.engines.mongo.fixtures import engine  # noqa
from tests.utils import mongo_tmp_db as tmp_db


TMP_DB = "tmp_test_db"


def test_get_db(engine: MongoEngine):  # noqa F811
    with pytest.raises(DBNotExists):
        engine.get_db("non_existing_db")

    with tmp_db(engine, TMP_DB, ""):
        engine.get_db(TMP_DB)


def test_create_db(engine: MongoEngine):  # noqa F811
    with tmp_db(engine, TMP_DB, ""):

        with pytest.raises(DBExists):
            engine.create_db(TMP_DB, "")

        db = engine.get_db(TMP_DB)
        assert db.tables[0].name == "collection"


def test_get_dump(engine: MongoEngine):  # noqa F811
    with tmp_db(engine, TMP_DB, ""):
        print(engine.get_dump(TMP_DB))
