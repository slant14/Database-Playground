import re
from datetime import datetime

import barely_json

from ..exceptions import ParsingError, QueryError
from ..models import MQT, MongoQuery

PATTERNS = (
   (MQT.GET_COLLECTION_NAMES, re.compile(r".*db\.getCollectionNames(.*).*")),
   (MQT.DROP_COLLECTION, re.compile(r".*db\..*\.drop(.*).*")),
   (MQT.INSERT_ONE, re.compile(r".*db\..*\.insertOne(.*).*")),
   (MQT.INSERT_MANY, re.compile(r".*db\..*\.insertMany(.*).*")),
   (MQT.FIND, re.compile(r".*db\..*\.find(.*).*")),
   (MQT.FIND_ONE, re.compile(r".*db\..*\.findOne(.*).*")),
   (MQT.AGGREGATE, re.compile(r".*db\..*\.aggregate(.*).*")),
   # TODO : add more patterns
)


def parse_mql(full_query: str) -> list[MongoQuery]:
    result = []
    for query in full_query.split(";"):
        if not query:
            continue
        # the following shit is done to remove \n
        # while keeping \\n that is likely needed by user
        query = query.strip() \
            .replace("\\n", "&&nkdk") \
            .replace("\n", "") \
            .replace("&&nkdk", "\\n")

        query_type = _determine_query_type(query)
        collection = ""
        query_input = None
        if query_type.value >= 2:
            collection = _extract_collection_name(query)
        if query_type.value >= 3:
            query_input_str = _extract_input_string(query)
            query_input = _parse_rjson(query_input_str)
        result.append(MongoQuery(query, query_type, collection, query_input))
    return result


def _parse_rjson(rjson: str | None) -> dict | list | None:
    """Parsing relaxed json \\
    Hopefully, its what is used by mongo
    """
    try:
        if not rjson: return None  # noqa
        data = barely_json.parse(rjson)
        data = _fix_types(data)
        return data  # type: ignore
    except Exception as e:
        raise ParsingError(str(e))


def _fix_types(data: dict | list | str):
    """Recursively fix types in the parsed relaxed JSON structure."""
    if isinstance(data, dict):
        return {k: _fix_types(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [_fix_types(item) for item in data]
    elif isinstance(data, str):
        val = data.strip()
        if (val.startswith('"') and val.endswith('"')) \
           or (val.startswith("'") and val.endswith("'")):
            val = val[1:-1]

        if val.startswith("ISODate(") and val.endswith(")"):
            inner = val[len("ISODate("):-1].strip()
            if (inner.startswith('"') and inner.endswith('"')) \
               or (inner.startswith("'") and inner.endswith("'")):
                inner = inner[1:-1]
            try:
                # Replace Z with UTC offset
                if inner.endswith("Z"):
                    inner = inner.replace("Z", "+00:00")
                return datetime.fromisoformat(inner)
            except ValueError:
                return val

        # Convert literals
        if val.lower() == "true":
            return True
        elif val.lower() == "false":
            return False
        elif val.lower() == "null":
            return None

        # Try to convert numbers
        try:
            if '.' in val:
                return float(val)
            else:
                return int(val)
        except ValueError:
            pass

        # Return as string
        return val
    else:
        return data


def _determine_query_type(query: str) -> MongoQuery.Type:
    for type, pattern in PATTERNS:
        if pattern.fullmatch(query):
            return type
    raise QueryError("Unknown Query: "+query)


def _extract_collection_name(query: str) -> str:
    db_index = query.find("db.")+3
    next_dot_index = query.find(".", db_index+1)
    return query[db_index:next_dot_index]


def _extract_input_string(query: str) -> str | None:
    start = query.find('(')
    end = query.rfind(')')
    if start == -1 or end == -1 or end <= start:
        return None  # malformed or no parentheses
    return query[start + 1:end].strip()
