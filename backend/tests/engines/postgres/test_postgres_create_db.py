from unittest.mock import MagicMock, patch

from tests.engines.postgres.fixtures import engine  # noqa F401


@patch("core.engines.PostgresEngine.psycopg2.connect")
def test_create_db_creates_and_initializes(mock_connect, engine):  # noqa F811
    # Setup mocks
    autocommit_conn = MagicMock()
    autocommit_cursor = MagicMock()
    connect_conn = MagicMock()
    connect_cursor = MagicMock()

    # Configure mocks for context manager support
    mock_connect.side_effect = [autocommit_conn, connect_conn]

    autocommit_conn.__enter__.return_value = autocommit_conn
    autocommit_conn.cursor \
                   .return_value.__enter__.return_value = autocommit_cursor

    connect_conn.__enter__.return_value = connect_conn
    connect_conn.cursor.return_value.__enter__.return_value = connect_cursor

    sql_dump = "CREATE TABLE test_table (id INT); " \
               "INSERT INTO test_table VALUES (1);"
    engine.create_db("my_test_db", sql_dump)

    # 1. Assert CREATE DATABASE was called
    create_call = autocommit_cursor.execute.call_args[0][0]
    assert "CREATE DATABASE" in str(create_call)
    assert "my_test_db" in str(create_call)

    # 2. Assert SQL dump was executed
    calls = [call_args[0][0]
             for call_args in connect_cursor.execute.call_args_list]
    assert "CREATE TABLE test_table (id INT)" in calls
    assert "INSERT INTO test_table VALUES (1)" in calls

    # 3. Assert commit called
    connect_conn.commit.assert_called_once()


@patch("core.engines.PostgresEngine.psycopg2.connect")
def test_create_db_with_empty_dump(mock_connect, engine):  # noqa F811
    conn = MagicMock()
    cursor = MagicMock()
    mock_connect.return_value = conn
    conn.cursor.return_value.__enter__.return_value = cursor

    engine.create_db("empty_db", "")  # Should not raise

    # Should call CREATE DATABASE
    create_call = cursor.execute.call_args_list[0][0][0]
    assert "CREATE DATABASE" in str(create_call)

    # Should not try to execute anything after that
    # Total of 1 call to `psycopg2.connect` = 1 for autocommit,
    # and 1 for real connection
    assert mock_connect.call_count == 2
