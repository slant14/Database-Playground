import pytest

from core.engines import MongoEngine
from core.engines.exceptions import (
    DBNotExists, DBExists
)
from core.engines.models import MongoQueryResult

from tests.engines.mongo.fixtures import engine  # noqa
from tests.utils import (
    mongo_tmp_db as tmp_db,
    remove_mongo_ids as remove_ids,
)


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


def test_send_query(engine: MongoEngine):  # noqa F811
    with tmp_db(engine, TMP_DB, ""):
        results = engine.send_query(
            TMP_DB,
            (
                "db.integra.insertOne({target: 'Alucard', age: 3021});"
                "db.integra.find();"
            )
        )
        assert all(isinstance(r, MongoQueryResult) for r in results)
        assert results[0].query == \
            "db.integra.insertOne({target: 'Alucard', age: 3021})"
        assert isinstance(results[0].data, dict)
        assert ("acknowledged", 'True') in results[0].data.items()
        assert "inserted_id" in results[0].data
        assert results[1].query == "db.integra.find()"
        assert isinstance(results[1].data, list)
        assert remove_ids(results[1].data[0]) == {  # type: ignore
            "target": "Alucard",
            "age": 3021
        }
