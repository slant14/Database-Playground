from contextlib import contextmanager
from urllib.parse import quote_plus
from pymongo import MongoClient

from .models import DBInfo, QueryResult
from .DBEngine import DBEngine
from .exceptions import DBNotExists, DBExists, QueryError


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

    def drop_db(self, db_name: str):
        with self._connect() as client:
            if db_name not in client.list_database_names():
                raise DBNotExists
            client.drop_database(db_name)

    def send_query(self, db_name: str, full_query: str) -> list[QueryResult]:
        raise NotImplementedError

    def get_dump(self, db_name: str) -> str:
        raise NotImplementedError

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