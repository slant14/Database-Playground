import re
import time
from abc import ABC, abstractmethod

from pymongo.database import Database as MongoDatabase

from .parsing import (
    extract_input_string,
    extract_collection_name,
    parse_rjson,
    fix_types_to_str,
    split_update_input,
    _fix_types
)
from ..models import MongoQueryResult
from ..exceptions import ParsingError


class MongoQuery(ABC):
    pattern: re.Pattern

    def __init__(self, str_query: str):
        self.query = str_query

    @classmethod
    def matches(cls, str_query: str) -> bool:
        """ Checks if string looks like that query """
        return cls.pattern.fullmatch(str_query) is not None

    def parse_and_execute(self, db: MongoDatabase) -> MongoQueryResult:
        """ Parses string query and executes it using
        provided database instance """
        self._parse()
        start_time = time.perf_counter()
        result = _fix_types(self._execute(db))
        end_time = time.perf_counter()
        return MongoQueryResult(
            self.query, result,
            end_time - start_time
        )

    @abstractmethod
    def _parse(self):
        """ Parses all necessary data from str_query """

    @abstractmethod
    def _execute(self, db: MongoDatabase) -> list | dict | None:
        """ Executes query using provided database instance """


class GetCollectionNames(MongoQuery):
    pattern = re.compile(r".*db\.getCollectionNames(.*).*")

    def _parse(self):
        input = extract_input_string(self.query)
        if input:
            raise ParsingError(
                "getCollectionNames() accepts no arguments,"
                f" but '{input}' provided"
            )

    def _execute(self, db: MongoDatabase):
        return db.list_collection_names()


class DropCollection(MongoQuery):
    pattern = re.compile(r".*db\..*\.drop(.*).*")

    def __init__(self, str_query: str):
        super().__init__(str_query)
        self.collection: str = ""

    def _parse(self):
        input = extract_input_string(self.query)
        if input:
            raise ParsingError(
                "drop() accepts no arguments,"
                f" but '{input}' provided"
            )
        collection = extract_collection_name(self.query)
        if not collection:
            raise ParsingError(
                "query db.<collection>.drop(),"
                " no collection provided"
            )
        self.collection = collection

    def _execute(self, db: MongoDatabase):
        return db.drop_collection(self.collection)


class InsertOne(MongoQuery):
    pattern = re.compile(r".*db\..*\.insertOne(.*).*")

    def __init__(self, str_query: str):
        super().__init__(str_query)
        self.collection: str = ""
        self.data: dict = {}

    def _parse(self):
        input = extract_input_string(self.query)
        data = parse_rjson(input)
        if not data or not isinstance(data, dict):
            raise ParsingError(
                "insertOne() accepts a single document"
                f" (relaxed json). Got '{data}'"
            )
        collection = extract_collection_name(self.query)
        if not collection:
            raise ParsingError(
                "query db.<collection>.insertOne(),"
                " no collection provided"
            )
        self.data = data
        self.collection = collection

    def _execute(self, db: MongoDatabase) -> list | dict | None:
        coll = db.get_collection(self.collection)
        result = coll.insert_one(self.data)
        return {
            "acknowledged": str(result.acknowledged),
            "inserted_id": str(result.inserted_id)
        }


class InsertMany(MongoQuery):
    pattern = re.compile(r".*db\..*\.insertMany(.*).*")

    def __init__(self, str_query: str):
        super().__init__(str_query)
        self.collection: str = ""
        self.data: list[dict] = []

    def _parse(self):
        input = extract_input_string(self.query)
        data = parse_rjson(input)
        if not data or not isinstance(data, list):
            raise ParsingError(
                "insertMany() accepts multiple documents"
                f" (list of relaxed jsons). Got '{data}'"
            )
        collection = extract_collection_name(self.query)
        if not collection:
            raise ParsingError(
                "query db.<collection>.insertMany(),"
                " no collection provided"
            )
        self.data = [obj for obj in data if obj]
        self.collection = collection

    def _execute(self, db: MongoDatabase) -> list | dict | None:
        coll = db.get_collection(self.collection)
        result = coll.insert_many(self.data)
        return {
            "acknowledged": str(result.acknowledged),
            "inserted_ids": [str(id) for id in result.inserted_ids]
        }


class Find(MongoQuery):
    pattern = re.compile(r".*db\..*\.find(.*).*")

    def __init__(self, str_query: str):
        super().__init__(str_query)
        self.collection: str = ""
        self.data: dict | None = None

    def _parse(self):
        input = extract_input_string(self.query)
        data = parse_rjson(input)
        if data and not isinstance(data, dict):
            raise ParsingError(
                "find() accepts either nothing or single document"
                f" (relaxed jsons). Got '{data}'"
            )
        collection = extract_collection_name(self.query)
        if not collection:
            raise ParsingError(
                "query db.<collection>.find(),"
                " no collection provided"
            )
        self.data = data  # type: ignore (i raise exception)
        self.collection = collection

    def _execute(self, db: MongoDatabase) -> list | dict | None:
        coll = db.get_collection(self.collection)
        cursor = coll.find(self.data)
        results = [fix_types_to_str(item) for item in cursor]
        return results


class FindOne(MongoQuery):
    pattern = re.compile(r".*db\..*\.findOne(.*).*")

    def __init__(self, str_query: str):
        super().__init__(str_query)
        self.collection: str = ""
        self.data: dict | None = None

    def _parse(self):
        input = extract_input_string(self.query)
        data = parse_rjson(input)
        if data and not isinstance(data, dict):
            raise ParsingError(
                "findOne() accepts either nothing or single document"
                f" (relaxed json). Got '{data}'"
            )
        collection = extract_collection_name(self.query)
        if not collection:
            raise ParsingError(
                "query db.<collection>.findOne(),"
                " no collection provided"
            )
        self.data = data  # type: ignore (i raise exception)
        self.collection = collection

    def _execute(self, db: MongoDatabase) -> list | dict | None:
        coll = db.get_collection(self.collection)
        cursor = coll.find_one(self.data)
        if not cursor:
            return []
        results = [fix_types_to_str(item) for item in cursor]
        return results


class UpdateOne(MongoQuery):
    pattern = re.compile(r".*db\..*\.updateOne(.*).*")

    def __init__(self, str_query: str):
        super().__init__(str_query)
        self.collection: str = ""
        self.filter: dict = {}
        self.update: dict = {}
        self.options: dict | None = None

    def _parse(self):
        input = extract_input_string(self.query)
        filter, update, options = split_update_input(input)
        filter = parse_rjson(filter)
        update = parse_rjson(update)
        options = parse_rjson(options)
        if not filter or not update:
            raise ParsingError(
                "updateOne() accepts multiple arguments "
                f"(filter, update, [options]). Got '{filter, update, options}'"
            )
        if isinstance(filter, list):
            raise ParsingError("updateOne() awaits for filter as relaxed "
                               f"json object, got list: {filter}")
        if isinstance(update, list):
            raise ParsingError("updateOne() awaits for update as relaxed "
                               f"json object, got list: {update}")
        if isinstance(options, list):
            raise ParsingError("updateOne() awaits for options as relaxed "
                               f"json object, got list: {options}")
        collection = extract_collection_name(self.query)
        if not collection:
            raise ParsingError("query db.<collection>.updateOne(), "
                               "no collection provided")
        self.collection = collection
        self.filter = filter
        self.update = update
        self.options = options

    def _execute(self, db: MongoDatabase) -> list | dict | None:
        coll = db.get_collection(self.collection)
        if self.options:
            result = coll.update_one(self.filter, self.update, **self.options)
        else:
            result = coll.update_one(self.filter, self.update)
        return {
            "acknowledged": str(result.acknowledged),
            "did_upsert": str(result.did_upsert),
            "matched_count": str(result.matched_count),
            "modified_count": str(result.modified_count),
            "upserted_id": str(result.upserted_id)
        }
