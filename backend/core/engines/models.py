from dataclassses imprort dataclass


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
                db.tables.append(TableInfo(
                    name=c[0], 
                    columns=[ColumnInfo(c[1], c[2])]
                ))
        return db

    
    def to_json(self) -> dict:
        return {
            "name": self.name,
            "tables": [t.to_json() for t in self.tables]
        }

    def __repr__(self) -> str:
        tables_str = ""
        for table in self.tables:
            tables_str += f"\n  {str(table).replace("\n", "\n  ")}"
        return (
            f"Database {self.name}:  {tables_str}"
        )


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
        return (
            f"Table {self.name}:{columns_str}"
        )


@dataclass
class ColumnInfo:
    name: str
    type: str

    def to_json(self) -> dict:
        return {
            "name": self.name,
            "type": self.type
        }

    def __repr__(self) -> str:
        return f"{self.name} - {self.type}"


@dataclass
class QueryResult:
    query: str
    rowcount: int
    data: list[tuple] | None
    execution_time: float

    def to_json(self) -> dict:
        return {
            "query": self.query,
            "rowcount": self.rowcount,
            "data": self.data,
            "exectuion_time": self.execution_time
        }