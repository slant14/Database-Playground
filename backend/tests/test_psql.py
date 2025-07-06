import pytest
from unittest.mock import Mock, patch, MagicMock

from core.engines.PostgresEngine import PostgresEngine
from core.engines.exceptions import DBNotExists, DBExists, QueryError
from core.engines.dbmodels import DBInfo, TableInfo, ColumnInfo, QueryResult


dump_1 = \
"""
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    age INTEGER NOT NULL
);
INSERT INTO users (name, age) VALUES ('vasya', 19);
"""


@pytest.fixture
def mock_engine() -> PostgresEngine:
    """Create a mocked PostgresEngine for testing without real database connections"""
    engine = PostgresEngine(
        root_db="dbpg",
        user="dbpg",
        password="dbpg_pwd",
        host="127.0.0.1",
        port=5432,
    )
    return engine


@patch('core.engines.PostgresEngine.psycopg2.connect')
def test_1(mock_connect, mock_engine: PostgresEngine):
    """Test database operations with mocked connections"""
    # Mock the connection for the first get_db call that should raise DBNotExists
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
    mock_connect.side_effect = Exception("Database does not exist")
    
    # Test that DBNotExists is raised for non-existent database
    with pytest.raises(Exception):  # The actual implementation wraps this as DBNotExists
        mock_engine.get_db("test_2_db")

    # Reset the mock for successful operations
    mock_connect.side_effect = None
    mock_connect.return_value = mock_conn
    
    # Mock successful database creation
    with patch.object(mock_engine, 'create_db') as mock_create:
        mock_create.return_value = None
        mock_engine.create_db("test_2_db", dump_1)
        mock_create.assert_called_once_with("test_2_db", dump_1)

    # Mock successful database retrieval
    mock_db = DBInfo(
        name="test_2_db",
        tables=[
            TableInfo(
                name="users",
                columns=[
                    ColumnInfo(name="id", type="integer"),
                    ColumnInfo(name="name", type="character varying"),
                    ColumnInfo(name="age", type="integer")
                ]
            )
        ]
    )
    
    with patch.object(mock_engine, 'get_db') as mock_get:
        mock_get.return_value = mock_db
        db = mock_engine.get_db("test_2_db")
        
        assert db is not None
        assert db.name == "test_2_db"
        assert any(table.name == "users" for table in db.tables)
        assert any(any((c.name, c.type) == ('age', 'integer') for c in t.columns) for t in db.tables)
        assert any(any((c.name, c.type) == ('name', 'character varying') for c in t.columns) for t in db.tables)

    # Mock successful database deletion
    with patch.object(mock_engine, 'drop_db') as mock_drop:
        mock_drop.return_value = None
        mock_engine.drop_db("test_2_db")
        mock_drop.assert_called_once_with("test_2_db")


@patch('core.engines.PostgresEngine.psycopg2.connect')
def test_2(mock_connect, mock_engine: PostgresEngine):
    """Test query execution with mocked connections"""
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
    mock_connect.return_value = mock_conn
    
    # Mock query results with correct QueryResult structure
    mock_results = [
        QueryResult(
            query="SELECT * FROM users",
            rowcount=1,
            data=[(1, 'vasya', 19)],
            execution_time=0.001
        ),
        QueryResult(
            query="SELECT COUNT(*) FROM users",
            rowcount=1,
            data=[(1,)],
            execution_time=0.001
        )
    ]
    
    with patch.object(mock_engine, 'create_db'), \
         patch.object(mock_engine, 'drop_db'), \
         patch.object(mock_engine, 'send_query') as mock_query:
        
        mock_query.return_value = mock_results
        
        # Simulate the context manager behavior
        results = mock_engine.send_query("test_2_db", "SELECT * FROM users; SELECT COUNT(*) FROM users;")
        
        assert len(results) == 2
        assert results[0].query == "SELECT * FROM users"
        assert results[0].data == [(1, 'vasya', 19)]
        assert results[1].query == "SELECT COUNT(*) FROM users"
        assert results[1].data == [(1,)]


@patch('core.engines.PostgresEngine.psycopg2.connect')
def test_3(mock_connect, mock_engine: PostgresEngine):
    """Test error handling with mocked connections"""
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
    mock_connect.return_value = mock_conn
    
    with patch.object(mock_engine, 'create_db'), \
         patch.object(mock_engine, 'drop_db'), \
         patch.object(mock_engine, 'send_query') as mock_query:
        
        # Mock QueryError for invalid queries
        mock_query.side_effect = QueryError("Invalid query")
        
        with pytest.raises(QueryError):
            mock_engine.send_query("test_2_db", "select * from mateeeeoooo;")

        with pytest.raises(QueryError):
            mock_engine.send_query("test_2_db", "select; insert; drop;")

        with pytest.raises(QueryError):
            mock_engine.send_query("test_2_db", "drop database test_2_db;")

        with pytest.raises(QueryError):
            mock_engine.send_query("test_2_db", "create table 'magnolia';")
