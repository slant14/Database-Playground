import time
import subprocess
from contextlib import contextmanager

import psycopg2
from psycopg2.sql import SQL, Identifier
from psycopg2.extensions import cursor

from .SQLEngine import SQLEngine
from .dbmodels import DBInfo, QueryResult
from .utility import postgres_wrap_exceptions as wrap_exceptions


SELECT_COLUMNS = \
"""
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
"""

CREATE_DATABASE = "CREATE DATABASE {};"

DROP_DATABASE = "DROP DATABASE {};"



class PostgresEngine(SQLEngine):

    @wrap_exceptions
    def get_db(self, db_name: str) -> DBInfo:
        with self._connect(db_name) as conn:
            with conn.cursor() as cur:
                cur.execute(SELECT_COLUMNS)
                result = cur.fetchall()
        return DBInfo.from_fetchall_columns(db_name, result)


    @wrap_exceptions
    def create_db(self, db_name: str, sql_dump: str):
        with self._connect_autocommit(self._root_db) as conn:
            with conn.cursor() as cur:
                cur.execute(SQL(CREATE_DATABASE).format(Identifier(db_name)))

        with self._connect(db_name) as conn:
            with conn.cursor() as cur:
                self._execute_sql_dump(cur, sql_dump)
                conn.commit()


    @wrap_exceptions
    def drop_db(self, db_name: str):
        with self._connect_autocommit(self._root_db) as conn:
            with conn.cursor() as cur:
                cur.execute(SQL(DROP_DATABASE).format(Identifier(db_name)))


    @wrap_exceptions
    def send_query(self, db_name: str, full_query: str) -> list[QueryResult]:
        results = []
        with self._connect(db_name) as conn:
            with conn.cursor() as cur:
                for query in self._split_queries(full_query):
                    cur.execute(query)
                    self._save_query_result(cur, query, results)
        return results


    def _execute_sql_dump(self, cur: cursor, sql_dump: str):
        queries = self._split_queries(sql_dump)
        for query in queries:
            cur.execute(query)
    
    
    def _save_query_result(self, cur: cursor, query: str, results: list[QueryResult]):
        rowcount = cur.rowcount
        data = None

        start = time.perf_counter()
        try:
            data = cur.fetchall()
        except psycopg2.ProgrammingError:
            pass
        execution_time = time.perf_counter() - start

        results.append(QueryResult(query, rowcount, data, execution_time))
                
            
    def _split_queries(self, big_query: str) -> list[str]:
        queries = []

        big_query = '\n'.join(
            line for line in big_query.split('\n') if 
            not any((line.startswith('--'), line.startswith('/*')))
        )

        for query in big_query.split(';'):
            query = query.strip()
            if not query:
                continue

            queries.append(query)

        return queries
    

    @contextmanager
    def _connect(self, db_name: str):
        """ Shorthand for standart `psycopg2` connection  
        Opens new transaction block, so cannot be used to create new databases  

        See: `self._connect_autocommit`
        """
        try:
            with psycopg2.connect(
                dbname=db_name,
                user=self._user,
                password=self._password,
                host=self._host,
                port=self._port
            ) as conn:
                yield conn
        finally:
            pass


    @contextmanager
    def _connect_autocommit(self, db_name: str):
        """ Connection with autocommit
        and without beginning of transaction block  
        Needed to create db as "CREATE DATABASE"
        cannot work inside the transaction block,
        which is opened by default using `with psycopg2.connect(...)`
        """
        conn = None
        try:
            conn = psycopg2.connect(
                dbname=db_name,
                user=self._user,
                password=self._password,
                host=self._host,
                port=self._port
            )
            conn.autocommit = True
            yield conn
        finally:
            if conn:
                conn.close()


    def get_dump(self, db_name: str) -> str:
        # check if db exists
        self.get_db(db_name)
        result = subprocess.run(
            [
                "pg_dump",
                "--no-comments",
                "--inserts",
                "--dbname",
                (
                    f"postgresql://{self._user}:{self._password}"
                    f"@{self._host}:{self._port}/{db_name}"
                )
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
        return result.stdout
