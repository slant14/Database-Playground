import pytest

from core.engines.PostgresEngine import PostgresEngine
from core.engines.exceptions import DBNotExists, DBExists, QueryError

from tests.engines.postgres.fixtures import engine
from tests.utils import postgres_tmp_db as tmp_db


DUMP_USERS = """
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    age INTEGER NOT NULL
);
INSERT INTO users (name, age) VALUES ('vasya', 19);
"""

class TestPostgresEngineLifecycle:
    def test_create_and_drop_db(self, engine: PostgresEngine):
        """Test DB creation, re-creation failure, and table introspection."""
        with pytest.raises(DBNotExists):
            engine.get_db("test_2_db")

        engine.create_db("test_2_db", DUMP_USERS)

        with pytest.raises(DBExists):
            engine.create_db("test_2_db", "")

        db = engine.get_db("test_2_db")
        engine.drop_db("test_2_db")

        assert db.name == "test_2_db"
        assert any(t.name == "users" for t in db.tables)

        users_table = next((t for t in db.tables if t.name == "users"), None)
        assert users_table is not None

        column_names_types = {(c.name, c.type) for c in users_table.columns}
        assert ('age', 'integer') in column_names_types
        assert ('name', 'character varying') in column_names_types


class TestPostgresEngineQueryExecution:
    def test_send_query_success(self, engine: PostgresEngine):
        """Test successful execution of multiple SELECT queries."""
        with tmp_db(engine, "test_2_db", DUMP_USERS):
            results = engine.send_query("test_2_db", "SELECT * FROM users; SELECT COUNT(*) FROM users;")
            assert len(results) == 2

            query1, query2 = results
            assert query1.query.startswith("SELECT * FROM users")
            assert query1.rowcount == 1
            assert query1.data == [(1, 'vasya', 19)]

            assert query2.query.startswith("SELECT COUNT(*) FROM users")
            assert query2.rowcount == 1
            assert query2.data == [(1,)]


    def test_send_query_fails(self, engine: PostgresEngine):
        """Test various malformed or unsafe queries trigger QueryError."""
        with tmp_db(engine, "test_2_db", DUMP_USERS):
            bad_queries = [
                "select * from mateeeeoooo;",
                "select; insert; drop;",
                "drop database test_2_db;",
                "create table 'magnolia';"
            ]

            for bad_query in bad_queries:
                with pytest.raises(QueryError):
                    engine.send_query("test_2_db", bad_query)


    def test_send_query_mixed_statements(self, engine: PostgresEngine):
        """Test execution of mixed SQL statements and return values from SELECTs only."""
        query = """
        CREATE TABLE products (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL
        );
        INSERT INTO products (name) VALUES ('apple'), ('banana');
        SELECT * FROM products;
        SELECT COUNT(*) FROM products;
        """

        with tmp_db(engine, "test_mixed_db", ""):
            results = engine.send_query("test_mixed_db", query)

            assert len(results) == 4

            # First SELECT
            assert results[2].query.strip().startswith("SELECT * FROM products")
            assert results[2].rowcount == 2
            assert results[2].data == [(1, 'apple'), (2, 'banana')]

            # Second SELECT
            assert results[3].query.strip().startswith("SELECT COUNT(*) FROM products")
            assert results[3].rowcount == 1
            assert results[3].data == [(2,)]



class TestPostgresEngineDump:
    def test_dump_export_and_reimport(self, engine: PostgresEngine):
        """Ensure a dumped DB can be recreated with the same structure."""
        DB1 = "test_2_db"
        DB2 = "another_test_db"

        with tmp_db(engine, DB1, DUMP_USERS):
            first_dump = engine.get_dump(DB1)
            first_schema = engine.get_db(DB1)

        second_schema = None
        engine.create_db(DB2, first_dump)
        try:
            second_schema = engine.get_db(DB2)
        finally:
            engine.drop_db(DB2)

        assert second_schema is not None
        assert first_schema.tables == second_schema.tables
