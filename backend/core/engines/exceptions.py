class DBNotExists(Exception):
    ...


class DBExists(Exception):
    ...


class QueryError(Exception):
    ...


class ParsingError(Exception):
    ...
