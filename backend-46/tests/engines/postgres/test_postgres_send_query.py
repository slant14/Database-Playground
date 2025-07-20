from unittest.mock import MagicMock, patch

import pytest
from core.engines.models import SQLQueryResult
from core.engines.PostgresEngine import PostgresEngine
from psycopg2 import ProgrammingError


@pytest.fixture
def engine():
    return PostgresEngine(user="test", password="test")


@patch("core.engines.PostgresEngine.psycopg2.connect")
def test_send_query_executes_all_queries_and_collects_results(
    mock_connect, engine
):
    # Setup mocks
    conn_mock = MagicMock()
    cursor_mock = MagicMock()

    mock_connect.return_value.__enter__.return_value = conn_mock
    conn_mock.cursor.return_value.__enter__.return_value = cursor_mock
    

    # Simulate result of SELECT query
    cursor_mock.fetchall.return_value = [("row1",), ("row2",)]
    cursor_mock.rowcount = 2
    cursor_mock.description = [["col"]]

    queries = "SELECT 1; SELECT 2;"
    results = engine.send_query("test_db", queries)

    # Check that both queries were executed
    executed_queries = [call[0][0] for call
                        in cursor_mock.execute.call_args_list]
    assert "SELECT 1" in executed_queries
    assert "SELECT 2" in executed_queries

    # Check result list
    assert len(results) == 2
    for result, expected_query in zip(results, ["SELECT 1", "SELECT 2"]):
        assert isinstance(result, SQLQueryResult)
        assert result.query == expected_query
        assert result.data == {
            "columns": ['col'],
            "data": {
                "col": ["row1", "row2",]
            }
        }
        assert result.rowcount == 2
        assert result.execution_time >= 0.0


@patch("core.engines.PostgresEngine.psycopg2.connect")
def test_send_query_handles_non_select_queries(mock_connect, engine):
    conn_mock = MagicMock()
    cursor_mock = MagicMock()
    mock_connect.return_value.__enter__.return_value = conn_mock
    conn_mock.cursor.return_value.__enter__.return_value = cursor_mock

    # Simulate INSERT query with no result
    cursor_mock.fetchall.side_effect = ProgrammingError("no results to fetch")
    cursor_mock.rowcount = 1

    queries = "INSERT INTO test (id) VALUES (1);"
    results = engine.send_query("test_db", queries)

    cursor_mock.execute.assert_called_once_with(
        "INSERT INTO test (id) VALUES (1)"
    )
    assert len(results) == 1
    assert results[0].query == "INSERT INTO test (id) VALUES (1)"
    assert results[0].data is None
    assert results[0].rowcount == 1
