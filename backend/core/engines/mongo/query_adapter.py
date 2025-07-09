import inspect
from typing import Sequence

from pymongo.command_cursor import CommandCursor
from pymongo.cursor import Cursor
from pymongo.database import Database as MongoDatabase
from pymongo.results import InsertManyResult, InsertOneResult

from ..exceptions import QueryError
from ..models import MQT, OldMongoQuery, MongoQueryResult
from .parsing import fix_types_to_str

from . import queries
from .queries import MongoQuery


def collect_mongo_queries() -> list[type[MongoQuery]]:
    return [
        cls for _, cls in inspect.getmembers(queries, inspect.isclass)
        if issubclass(cls, MongoQuery) and cls is not MongoQuery
    ]


QUERIES = collect_mongo_queries()


def execute_full_query(
        full_query: str,
        db: MongoDatabase
) -> Sequence[MongoQueryResult]:
    return [
        get_matching_query(str_query).parse_and_execute(db)
        for str_query in split_full_query(full_query)
    ]


def split_full_query(full_query: str) -> list[str]:
    return [escape_query(q) for q in full_query.split(';') if q]


def escape_query(str_query: str) -> str:
    # the following shit is done to remove \n
    # while keeping \\n that is likely needed by user
    return str_query.strip() \
        .replace("\\n", "&&nkdk") \
        .replace("\n", "") \
        .replace("&&nkdk", "\\n")


def get_matching_query(str_query: str) -> MongoQuery:
    for Query in QUERIES:
        if Query.matches(str_query):
            return Query(str_query)
    raise QueryError(f"Unknown Query: '{str_query}'")


def execute_queries(
        queries: list[OldMongoQuery],
        db: MongoDatabase
) -> Sequence[MongoQueryResult]:
    try:
        return [_wrap_result(q, _execute_query(q, db)) for q in queries]
    except Exception as e:
        raise QueryError(str(e))


def _execute_query(query: OldMongoQuery, db: MongoDatabase):
    match (query.type):
        case MQT.GET_COLLECTION_NAMES:
            return db.list_collection_names()

        case MQT.DROP_COLLECTION:
            return db.drop_collection(query.collection)

        case MQT.INSERT_ONE:
            coll = db.get_collection(query.collection)
            return coll.insert_one(query.input)

        case MQT.INSERT_MANY:
            coll = db.get_collection(query.collection)
            if not isinstance(query.input, list):
                raise QueryError("query.input is not list")
            return coll.insert_many(query.input)

        case MQT.FIND:
            coll = db.get_collection(query.collection)
            return coll.find(query.input)

        case MQT.FIND_ONE:
            coll = db.get_collection(query.collection)
            return coll.find_one(query.input)

        case MQT.AGGREGATE:
            coll = db.get_collection(query.collection)
            if not isinstance(query.input, list):
                raise QueryError("query.input is not list")
            return coll.aggregate(query.input)


def _wrap_result(
        q: OldMongoQuery,
        raw_result
) -> MongoQueryResult:  # type: ignore
    match (q.type):
        case MQT.GET_COLLECTION_NAMES:
            return MongoQueryResult(q.query, raw_result, 0)

        case MQT.DROP_COLLECTION:
            return MongoQueryResult(q.query, raw_result, 0)

        case MQT.INSERT_ONE:
            io: InsertOneResult = raw_result
            return MongoQueryResult(q.query, {
                "acknowledged": str(io.acknowledged),
                "inserted_id": str(io.inserted_id)
            }, 0)

        case MQT.INSERT_MANY:
            im: InsertManyResult = raw_result
            return MongoQueryResult(q.query, {
                "acknowledged": str(im.acknowledged),
                "inserted_ids": [str(id) for id in im.inserted_ids]
            }, 0)

        case MQT.FIND:
            c: Cursor = raw_result
            items = [fix_types_to_str(i) for i in c]
            return MongoQueryResult(q.query, items, 0)

        case MQT.AGGREGATE:
            cc: CommandCursor = raw_result
            items = [fix_types_to_str(i) for i in cc]
            return MongoQueryResult(q.query, items, 0)

        case _:
            raise Exception("Unknown raw_result", raw_result)
