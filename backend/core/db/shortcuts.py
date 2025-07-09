from engines import DBEngine, mongo_engine, postgres_engine
from templates.models import DBType


def get_db_engine(type: str) -> DBEngine | None:
    match type:
        case DBType.POSTGRES.value:
            return postgres_engine
        case DBType.MONGODB.value:
            return mongo_engine
    return None
