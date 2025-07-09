import pytest
from core.engines import MongoEngine
from core.engines.exceptions import DBExists, DBNotExists, QueryError, ParsingError
from core.engines.models import MongoQueryResult
from tests.engines.mongo.fixtures import engine  # noqa
from tests.utils import integration_test
from tests.utils import mongo_tmp_db as tmp_db
from tests.utils import remove_mongo_ids as remove_ids

TMP_DB = "tmp_test_db"


@integration_test
def test_get_db(engine: MongoEngine):  # noqa F811
    with pytest.raises(DBNotExists):
        engine.get_db("non_existing_db")

    with tmp_db(engine, TMP_DB, ""):
        engine.get_db(TMP_DB)


@integration_test
def test_create_db(engine: MongoEngine):  # noqa F811
    with tmp_db(engine, TMP_DB, ""):

        with pytest.raises(DBExists):
            engine.create_db(TMP_DB, "")

        db = engine.get_db(TMP_DB)
        assert db.tables[0].name == "collection"


@integration_test
def test_get_dump(engine: MongoEngine):  # noqa F811
    with tmp_db(engine, TMP_DB, ""):
        print(engine.get_dump(TMP_DB))


@integration_test
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
        assert ("acknowledged", True) in results[0].data.items()
        assert "inserted_id" in results[0].data
        assert results[1].query == "db.integra.find()"
        assert isinstance(results[1].data, list)
        assert remove_ids(results[1].data[0]) == {  # type: ignore
            "target": "Alucard",
            "age": 3021
        }


@integration_test
def test_multiple_inserts_and_find(engine: MongoEngine):  # noqa F811
    with tmp_db(engine, TMP_DB, ""):
        results = engine.send_query(
            TMP_DB,
            (
                "db.integra.insertOne({name: 'A'});"
                "db.integra.insertOne({name: 'B'});"
                "db.integra.find();"
            )
        )
        assert len(results) == 3
        assert all(isinstance(r, MongoQueryResult) for r in results)
        assert all(r.query.startswith("db.integra.") for r in results)
        inserted_docs = [
            remove_ids(doc) for doc in results[2].data  # type: ignore
        ]
        assert {"name": "A"} in inserted_docs
        assert {"name": "B"} in inserted_docs


@integration_test
def test_data_types_parsing(engine: MongoEngine):  # noqa F811
    with tmp_db(engine, TMP_DB, ""):
        engine.send_query(
            TMP_DB,
            (
                "db.integra.insertOne("
                "{flag: true, deleted: false, missing: null, score: 3.14}"
                ");"
            )
        )
        results = engine.send_query(TMP_DB, "db.integra.find();")
        doc = remove_ids(results[0].data[0])  # type: ignore
        assert doc == {
            "flag": True,
            "deleted": False,
            "missing": None,
            "score": 3.14
        }


@integration_test
def test_isodate_parsing(engine: MongoEngine):  # noqa F811
    from datetime import datetime

    with tmp_db(engine, TMP_DB, ""):
        engine.send_query(
            TMP_DB,
            "db.integra.insertOne("
            "{createdAt: ISODate('2023-07-02T15:04:05Z')}"
            ");"
        )
        results = engine.send_query(TMP_DB, "db.integra.find();")
        created_at = results[0].data[0]["createdAt"]  # type: ignore
        assert isinstance(created_at, str)
        assert created_at == '2023-07-02 15:04:05'


@integration_test
def test_nested_document(engine: MongoEngine):  # noqa F811
    with tmp_db(engine, TMP_DB, ""):
        engine.send_query(
            TMP_DB,
            "db.integra.insertOne({user: {name: 'Alucard', age: 5000}});"
        )
        results = engine.send_query(TMP_DB, "db.integra.find();")
        doc = remove_ids(results[0].data[0])  # type: ignore
        assert doc == {
            "user": {
                "name": "Alucard",
                "age": 5000
            }
        }


@integration_test
def test_array_values(engine: MongoEngine):  # noqa F811
    with tmp_db(engine, TMP_DB, ""):
        engine.send_query(
            TMP_DB,
            "db.integra.insertOne({tags: ['vampire', 'immortal', 'night']});"
        )
        results = engine.send_query(TMP_DB, "db.integra.find();")
        doc: dict = remove_ids(results[0].data[0])  # type: ignore
        assert doc["tags"] == ["vampire", "immortal", "night"]


@integration_test
def test_query_errors(engine: MongoEngine):  # noqa F811
    with tmp_db(engine, TMP_DB, ""):
        with pytest.raises(ParsingError):
            engine.send_query(
                TMP_DB,
                "db.integra.insertOne(this is some bullshit here);"
            )
        with pytest.raises(QueryError, match=r'Unknown Query:.*'):
            engine.send_query(
                TMP_DB,
                "db.integra.invalid(this is some bullshit here);"
            )


@integration_test
def test_query_get_collections(engine: MongoEngine):  # noqa F811
    with tmp_db(engine, TMP_DB, ""):
        results = engine.send_query(TMP_DB, r"db.getCollectionNames()")

        assert len(results) == 1
        assert results[0].data == ['collection']

        engine.send_query(TMP_DB, r'db.new_col.insertOne({data: 3})')
        results = engine.send_query(TMP_DB, r"db.getCollectionNames()")

        assert len(results) == 1
        assert isinstance(results[0].data, list)
        assert sorted(results[0].data) == sorted(['collection', 'new_col'])


@integration_test
def test_query_update_one(engine: MongoEngine):  # noqa F811
    with tmp_db(engine, TMP_DB, ""):
        results = engine.send_query(
            TMP_DB,
            (
                r"db.collection.updateOne("
                r"  {hello: 'world'},"
                r"  {$set: {hello: 'man'}}"
                r")"
            )
        )

        assert len(results) == 1
        assert results[0].data == {
            "acknowledged": True,
            "did_upsert": False,
            "matched_count": 1,
            "modified_count": 1,
            "upserted_id": None
        }

