from abc import ABC, abstractmethod

from .models import DBInfo, QueryResult


class SQLEngine(ABC):

    def __init__(
        self,
        root_db: str,
        host: str,
        port: int,
        user: str,
        password: str,
    ):
        self._root_db = root_db
        self._host = host
        self._port = port
        self._user = user
        self._password = password

    @abstractmethod
    def get_db(self, db_name: str) -> DBInfo:
        """ Returns `DBInfo` if exists

        :raises DBNotExists:
        """
    
    @abstractmethod
    def create_db(self, db_name: str, sql_dump: str):
        """ Creates database and executes `sql_dump` 
        to create tables and populate with data 

        :raises DBExists:
        :raises QueryError:
        """

    @abstractmethod
    def drop_db(self, db_name: str):
        """ Drops database by name

        :raises DBNotExists:
        """

    @abstractmethod
    def send_query(self, db_name: str, full_query: str) -> list[QueryResult]:
        """ Sends query to database,
        returns the output of subqueries as a list

        :raises DBNotExists:
        :raises QueryError:
        """
