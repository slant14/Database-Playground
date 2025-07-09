from contextlib import contextmanager
from typing import Sequence
from urllib.parse import quote_plus

from bson import json_util
from pymongo import MongoClient
from pymongo.database import Database

from .DBEngine import DBEngine
from .exceptions import DBExists, DBNotExists
from .models import DBInfo, QueryResult
from .mongo.query_adapter import execute_full_query

# needed because db cannot be created without data in it
DEFAULT_DUMP = '{ "db": { "collection": [ { "hello": "world" } ] } }'


class MongoEngine(DBEngine):

    def __init__(
        self,
        user: str,
        password: str,
        host: str = "127.0.0.1",
        port: int = 27017,
    ):
        super().__init__(user, password, host, port)
        self._conn_uri = self._gen_connection_uri()

    def get_db(self, db_name: str) -> DBInfo:
        with self._connect() as client:
            if db_name not in client.list_database_names():
                raise DBNotExists
            db = client.get_database(db_name)
            return DBInfo.from_collection_names(
                db_name, db.list_collection_names()
            )

    def create_db(self, db_name: str, dump: str):
        with self._connect() as client:
            if db_name in client.list_database_names():
                raise DBExists
            db = client.get_database(db_name)
            db.create_collection("collection")
            self._apply_dump(db, dump or DEFAULT_DUMP)

    def drop_db(self, db_name: str):
        with self._connect() as client:
            if db_name not in client.list_database_names():
                raise DBNotExists
            client.drop_database(db_name)

    def send_query(
            self, db_name: str, full_query: str) -> Sequence[QueryResult]:
        with self._connect() as client:
            db = client.get_database(db_name)
            return execute_full_query(full_query, db)

    def get_dump(self, db_name: str) -> str:
        with self._connect() as client:
            if db_name not in client.list_database_names():
                raise DBNotExists
            db = client.get_database(db_name)
            return self._get_dump(db)

    @contextmanager
    def _connect(self):
        with MongoClient(
            host=self._conn_uri,
            port=self._port
        ) as client:
            yield client

    def _gen_connection_uri(self) -> str:
        return "mongodb://%s:%s@%s" % (
            quote_plus(self._user),
            quote_plus(self._password),
            self._host
        )

    def _apply_dump(self, db: Database, dump: str):
        data: dict = json_util.loads(dump)
        db_dump: dict[str, list[dict]] = data["db"]
        for coll_name, coll_data in db_dump.items():
            collection = db.get_collection(coll_name)
            collection.insert_many(coll_data)

    def _get_dump(self, db: Database) -> str:
        data = {"db": {}}
        for coll_name in db.list_collection_names():
            collection = db.get_collection(coll_name)
            coll_data = collection.find().to_list()
            data["db"][coll_name] = coll_data
        return json_util.dumps(data, indent=2, ensure_ascii=False)
