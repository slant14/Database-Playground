from core.engines import PostgresEngine
from tests.engines.postgres.fixtures import engine  # noqa F401


def test_regular_split(engine: PostgresEngine):  # noqa F811
    """ Test of how queries splitted regularly """

    queries = engine._split_queries("""
    CREATE TABLE users;
    ALTER TABLE users ADD COLUMN (
        id SERIAL PRIMARY KEY
    );
    INSERT INTO users DEFAULT VALUES;
    INSERT INTO users DEFAULT VALUES;
    """)

    assert len(queries) == 4
    assert queries[0] == "CREATE TABLE users"
    assert queries[1].startswith("ALTER TABLE users ADD COLUMN (")
    assert queries[1].endswith(")")
    assert queries[2] == "INSERT INTO users DEFAULT VALUES"
    assert queries[3] == "INSERT INTO users DEFAULT VALUES"


def test_stripping(engine: PostgresEngine):  # noqa F811
    """ Test of how queries are stripped when splitted """

    queries = engine._split_queries("""
    CREATE TABLE users (id SERIAL PRIMARY KEY)
        ; INSERT INTO users DEFAULT VALUES  ;
    """)

    assert len(queries) == 2
    assert queries[0] == "CREATE TABLE users (id SERIAL PRIMARY KEY)"
    assert queries[1] == "INSERT INTO users DEFAULT VALUES"
