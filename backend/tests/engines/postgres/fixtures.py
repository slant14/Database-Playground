import pytest
from core.engines import PostgresEngine


@pytest.fixture
def engine() -> PostgresEngine:
    return PostgresEngine(
        root_db="dbpg",
        user="dbpg",
        password="dbpg_pwd",
        host="127.0.0.1",
        port=5432,
    )
