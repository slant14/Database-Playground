import re
import barely_json
from enum import Enum
from dataclasses import dataclass


@dataclass
class MongoQuery:

    class Type(Enum):
        CREATE_COLLECTION = 0
        GET_COLLECTION_NAMES = 1
        DROP_COLLECTION = 2
        INSERT_ONE = 3
        INSERT_MANY = 4
        FIND = 5
        FIND_ONE = 6
        AGGREGATE = 7
        UPDATE = 8

    type: Type
    collection: str | None
    input: str | list | dict | None


MQT = MongoQuery.Type

PATTERNS = (
   (MQT.CREATE_COLLECTION, re.compile(r".*db\.createCollection(.*).*")),  # db.createCollection("any_name")
   (MQT.DROP_COLLECTION, re.compile(r".*db\..*\.drop().*")),              # db.<collection>.drop()
   (MQT.INSERT_ONE, re.compile(r".*db\..*\.insertOne(.*).*")),            # db.<collection>.insertOne(RJSON)
   (MQT.INSERT_MANY, re.compile(r".*db\..*\.insertMany(.*).*")),          # db.<collection>.insertMany(RJSON)
   (MQT.FIND, re.compile(r".*db\..*\.find(.*).*")),                       # db.<collection>.find(RJSON)
   # TODO : add more patterns
)


def parse_rjson(rjson: str | None) -> dict | list | None:
    """Parsing relaxed json \\
    Hopefully, its what is used by mongo
    """
    if not rjson: return None  # noqa
    data = barely_json.parse(rjson)
    return data


def parse_mql(full_query: str) -> list[MongoQuery]:
    result = []
    for query in full_query.split(";"):
        # the following shit is done to remove \n
        # while keeping \\n that is likely needed by user
        query = query.strip() \
            .replace("\\n", "&&nkdk") \
            .replace("\n", "") \
            .replace("&&nkdk", "\\n")

        query_type = determine_query_type(query)
        collection = None
        query_input = None
        if query_type.value >= 2:
            collection = extract_collection_name(query)
        if query_type.value >= 3:
            query_input_str = extract_input_string(query)
            query_input = parse_rjson(query_input_str)
        result.append(MongoQuery(query_type, collection, query_input))
    return result


def determine_query_type(query: str) -> MongoQuery.Type:
    for type, pattern in PATTERNS:
        if pattern.fullmatch(query):
            return type
    raise Exception("Unknown Query: "+query)  # TODO: set custom exception


def extract_collection_name(query: str) -> str:
    db_index = query.find("db.")+3
    next_dot_index = query.find(".", db_index+1)
    return query[db_index:next_dot_index]


def extract_input_string(query: str) -> str | None:
    start = query.find('(')
    end = query.rfind(')')
    if start == -1 or end == -1 or end <= start:
        return None  # malformed or no parentheses
    return query[start + 1:end].strip()
