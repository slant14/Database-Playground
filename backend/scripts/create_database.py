from core.engines import PostgresEngine


DUMP = \
"""
CREATE TABLE users (
    id serial primary key,
    name varchar(30) not null,
    email varchar(50) not null,
    status varchar(10) default 'gay'
);

INSERT INTO users (name, email) VALUES ('Nick', 'nick@nigga.com');
INSERT INTO users (name, email, status) VALUES ('Stepan', 'upconett@gmail.com', 'straight');
"""


def do_it():
    engine = PostgresEngine(
        root_db="dbpg",
        host="localhost",
        port=5432,
        user="dbpg",
        password="dbpg_pwd"
    )

    engine.create_db("bd", DUMP)


if __name__ == "__main__":
    do_it()
