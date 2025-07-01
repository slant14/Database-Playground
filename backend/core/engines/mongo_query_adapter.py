import json
from pymongo.results import (
    InsertOneResult,
    InsertManyResult,
)
from pymongo.cursor import Cursor
from pymongo.command_cursor import CommandCursor

from .mongo_parsing import MongoQuery
from .models import QueryResult
from .MongoEngine import Database as MongoDatabase


def execute_queries(
        queries: list[MongoQuery],
        db: MongoDatabase
    ) -> list[QueryResult]:
    return [_wrap_result(q, q.execute(db)) for q in queries]


def _wrap_result(q: MongoQuery, raw_result) -> QueryResult:
    if isinstance(raw_result, list) or isinstance(raw_result, dict):
        return QueryResult("", 0, json.dumps(raw_result), 0)
    if isinstance(raw_result, InsertOneResult):
        return QueryResult("", 0, {
            "acknowledged": str(raw_result.acknowledged),
            "inserted_id": str(raw_result.inserted_id)
        }, 0)
    if isinstance(raw_result, InsertManyResult):
        return QueryResult("", 0, {
            "acknowledged": str(raw_result.acknowledged),
            "inserted_ids": [str(id) for id in raw_result.inserted_ids]
        }, 0)
    if isinstance(raw_result, Cursor) or isinstance(raw_result, CommandCursor):
        items = [r for r in raw_result]
        return QueryResult("", 0, items, 0)
            
    raise Exception("Unknown raw_result", raw_result)