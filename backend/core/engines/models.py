from dataclasses import dataclass
from enum import Enum
from typing import TypeAlias


@dataclass
class DBInfo:
    name: str
    tables: list["TableInfo"]

    @staticmethod
    def from_fetchall_columns(db_name: str, columns: list[tuple]) -> "DBInfo":
        db = DBInfo(db_name, tables=[])
        for c in columns:
            for t in db.tables:
                if c[0] == t.name:
                    t.columns.append(ColumnInfo(c[1], c[2]))
                    break
            else:
                db.tables.append(
                    TableInfo(name=c[0], columns=[ColumnInfo(c[1], c[2])])
                )
        return db

    @staticmethod
    def from_collection_names(
        db_name: str,
        collections: list[str]
    ) -> "DBInfo":
        db = DBInfo(db_name, tables=[])
        for c in collections:
            db.tables.append(TableInfo(c, []))
        return db

    def to_json(self) -> dict:
        return {
            "name": self.name,
            "tables": [t.to_json() for t in self.tables]
        }

    def __repr__(self) -> str:
        tables_str = ""
        for table in self.tables:
            tables_str += "\n  "+str(table).replace("\n", "\n  ")
        return f"Database {self.name}:  {tables_str}"


@dataclass
class TableInfo:
    name: str
    columns: list["ColumnInfo"]

    def to_json(self) -> dict:
        return {
            "name": self.name,
            "columns": [c.to_json() for c in self.columns]
        }

    def __repr__(self) -> str:
        columns_str = ""
        for column in self.columns:
            columns_str += f"\n  {column}"
        return f"Table {self.name}:{columns_str}"


@dataclass
class ColumnInfo:
    name: str
    type: str

    def to_json(self) -> dict:
        return {"name": self.name, "type": self.type}

    def __repr__(self) -> str:
        return f"{self.name} - {self.type}"


@dataclass
class SQLQueryResult:
    query: str
    rowcount: int
    data: dict | list[tuple] | None
    execution_time: float

    def to_json(self) -> dict:
        return {
            "query": self.query,
            "rowcount": self.rowcount,
            "data": self.data,
            "execution_time": self.execution_time,
        }


@dataclass
class OldMongoQuery:

    class Type(Enum):
        GET_COLLECTION_NAMES = 1
        DROP_COLLECTION = 2
        INSERT_ONE = 3
        INSERT_MANY = 4
        FIND = 5
        FIND_ONE = 6
        AGGREGATE = 7
        UPDATE_ONE = 8  # TODO: implement
        UPDATE_MANY = 9  # TODO: implement

    query: str
    type: Type
    collection: str
    input: str | list | dict | None


MQT = OldMongoQuery.Type


@dataclass
class MongoQueryResult:
    query: str
    data: list | dict | None
    execution_time: float

    def to_json(self) -> dict:
        return {
            "query": self.query,
            "data": self.data,
            "execution_time": self.execution_time,
        }


QueryResult: TypeAlias = SQLQueryResult | MongoQueryResult
