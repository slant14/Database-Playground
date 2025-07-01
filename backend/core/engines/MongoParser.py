import barely_json


def parse_rjson(rjson: str) -> dict | list:
    """Parsing relaxed json \\
    Hopefully, its what is used by mongo
    """
    data = barely_json.parse(rjson)
    return data
