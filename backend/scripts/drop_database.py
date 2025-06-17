from core.engines import PostgresEngine


def do_it():
    engine = PostgresEngine(
        root_db="dbpg",
        host="localhost",
        port=5432,
        user="dbpg",
        password="dbpg_pwd"
    )

    engine.drop_db("bd")


if __name__ == "__main__":
    do_it()
