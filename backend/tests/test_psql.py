import pytest

from core.engines.PostgresEngine import PostgresEngine
from core.engines.exceptions import DBNotExists, DBExists, QueryError

from tests.utils import postgres_tmp_db as tmp_db


dump_1 = \
"""
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    age INTEGER NOT NULL
);
INSERT INTO users (name, age) VALUES ('vasya', 19);
"""


@pytest.fixture
def engine() -> PostgresEngine:
    return PostgresEngine(
        root_db="dbpg",
        user="dbpg",
        password="dbpg_pwd",
        host="127.0.0.1",
        port=5432,
    )


def test_1(engine: PostgresEngine):
    with pytest.raises(DBNotExists):
        engine.get_db("test_2_db")

    engine.create_db("test_2_db", dump_1)

    with pytest.raises(DBExists):
        engine.create_db("test_2_db", "")

    db = engine.get_db("test_2_db")
    engine.drop_db("test_2_db")

    assert db is not None
    assert db.name == "test_2_db"
    assert any(table.name == "users" for table in db.tables)
    assert any(any((c.name, c.type) == ('age', 'integer') for c in t.columns) for t in db.tables)
    assert any(any((c.name, c.type) == ('name', 'character varying') for c in t.columns) for t in db.tables)


def test_2(engine: PostgresEngine):
    with tmp_db(engine, "test_2_db", dump_1):
        results = engine.send_query("test_2_db", "SELECT * FROM users; SELECT COUNT(*) FROM users;")
        for r in results:
            print(r)


def test_3(engine: PostgresEngine):
    with tmp_db(engine, "test_2_db", dump_1):

        with pytest.raises(QueryError):
            engine.send_query("test_2_db", "select * from mateeeeoooo;")

        with pytest.raises(QueryError):
            engine.send_query("test_2_db", "select; insert; drop;")

        with pytest.raises(QueryError):
            engine.send_query("test_2_db", "drop database test_2_db;")

        with pytest.raises(QueryError):
            engine.send_query("test_2_db", "create table 'magnolia';")
