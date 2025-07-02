from pymongo.results import (
    InsertOneResult,
    InsertManyResult,
)
from pymongo.cursor import Cursor
from pymongo.command_cursor import CommandCursor

from .models import MongoQuery, MQT, MongoQueryResult
from .MongoEngine import Database as MongoDatabase


def execute_queries(
        queries: list[MongoQuery],
        db: MongoDatabase
) -> list[MongoQueryResult]:
    return [_wrap_result(q, _execute_query(q, db)) for q in queries]


def _execute_query(query: MongoQuery, db: MongoDatabase):
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
                # TODO: add custom exception
                raise Exception("query.input is not list")
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
                # TODO: add custom exception
                raise Exception("query.input is not list")
            return coll.aggregate(query.input)


def _wrap_result(
        q: MongoQuery,
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
            items = [i for i in c]
            return MongoQueryResult(q.query, items, 0)

        case MQT.AGGREGATE:
            cc: CommandCursor = raw_result
            items = [i for i in cc]
            return MongoQueryResult(q.query, items, 0)

        case _:
            raise Exception("Unknown raw_result", raw_result)
