from abc import ABC, abstractmethod
from typing import Sequence

from .models import DBInfo, QueryResult


class DBEngine(ABC):

    def __init__(
        self,
        user: str,
        password: str,
        host: str,
        port: int,
    ):
        self._user = user
        self._password = password
        self._host = host
        self._port = port

    @abstractmethod
    def get_db(self, db_name: str) -> DBInfo:
        """Returns `DBInfo` if exists

        :raises DBNotExists:
        """

    @abstractmethod
    def create_db(self, db_name: str, dump: str):
        """Creates database and executes `sql_dump`
        to create tables and populate with data

        :raises DBExists:
        :raises QueryError:
        """

    @abstractmethod
    def drop_db(self, db_name: str):
        """Drops database by name

        :raises DBNotExists:
        """

    @abstractmethod
    def send_query(self, db_name: str, full_query: str) -> Sequence[QueryResult]:
        """Sends query to database,
        returns the output of subqueries as a list

        :raises DBNotExists:
        :raises QueryError:
        """

    @abstractmethod
    def get_dump(self, db_name: str) -> str:
        """Returns the SQL dump of a database

        :raises DBNotExists:
        """
