from core.engines import PostgresEngine


QUERY = \
"""
SELECT * FROM users;
"""

def do_it():
    engine = PostgresEngine(
        root_db="dbpg",
        host="localhost",
        port=5432,
        user="dbpg",
        password="dbpg_pwd"
    )

    print(engine.send_query("bd", QUERY))


if __name__ == "__main__":
    do_it()
