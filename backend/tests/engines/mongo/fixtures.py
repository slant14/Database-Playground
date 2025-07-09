import pytest
from core.engines import MongoEngine


@pytest.fixture
def engine() -> MongoEngine:
    return MongoEngine(
        user="dbpg",
        password="dbpg_pwd",
        host="127.0.0.1",
    )
