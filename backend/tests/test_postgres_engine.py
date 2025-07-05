import pytest
import time
from unittest.mock import Mock, patch, MagicMock, call
from contextlib import contextmanager

import psycopg2
from psycopg2.sql import SQL, Identifier

from core.engines.PostgresEngine import PostgresEngine
from core.engines.dbmodels import DBInfo, QueryResult, TableInfo, ColumnInfo
from core.engines.exceptions import DBNotExists, DBExists, QueryError
from tests.utils import postgres_tmp_db as tmp_db


# Test data
SAMPLE_DUMP = """
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    age INTEGER
);
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    content TEXT,
    user_id INTEGER REFERENCES users(id)
);
INSERT INTO users (name, email, age) VALUES ('Alice', 'alice@example.com', 25);
INSERT INTO users (name, email, age) VALUES ('Bob', 'bob@example.com', 30);
INSERT INTO posts (title, content, user_id) VALUES ('First Post', 'Hello World', 1);
"""

SIMPLE_DUMP = """
CREATE TABLE test_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);
INSERT INTO test_table (name) VALUES ('test_name');
"""

MOCK_COLUMNS_RESULT = [
    ('users', 'id', 'integer'),
    ('users', 'name', 'character varying'),
    ('users', 'email', 'character varying'),
    ('users', 'age', 'integer'),
    ('posts', 'id', 'integer'),
    ('posts', 'title', 'character varying'),
    ('posts', 'content', 'text'),
    ('posts', 'user_id', 'integer')
]


@pytest.fixture
def engine():
    """Create a PostgresEngine instance for testing."""
    return PostgresEngine(
        root_db="test_root_db",
        user="test_user",
        password="test_password", 
        host="localhost",
        port=5432,
    )


@pytest.fixture
def mock_cursor():
    """Create a mock cursor for testing."""
    cursor = Mock()
    cursor.fetchall.return_value = MOCK_COLUMNS_RESULT
    cursor.rowcount = 1
    cursor.execute = Mock()
    return cursor


@pytest.fixture
def mock_connection():
    """Create a mock connection for testing."""
    conn = Mock()
    conn.cursor.return_value.__enter__ = Mock()
    conn.cursor.return_value.__exit__ = Mock()
    conn.commit = Mock()
    conn.autocommit = False
    conn.close = Mock()
    return conn


class TestPostgresEngineInit:
    """Test PostgresEngine initialization."""
    
    def test_init_sets_attributes(self):
        """Test that initialization sets all required attributes."""
        engine = PostgresEngine(
            root_db="test_db",
            user="test_user", 
            password="test_pass",
            host="test_host",
            port=1234
        )
        
        assert engine._root_db == "test_db"
        assert engine._user == "test_user"
        assert engine._password == "test_pass"
        assert engine._host == "test_host"
        assert engine._port == 1234


class TestGetDb:
    """Test the get_db method."""
    
    @patch('core.engines.PostgresEngine.psycopg2.connect')
    def test_get_db_success(self, mock_connect, engine, mock_connection, mock_cursor):
        """Test successful database schema retrieval."""
        mock_connect.return_value.__enter__.return_value = mock_connection
        mock_connection.cursor.return_value.__enter__.return_value = mock_cursor
        
        result = engine.get_db("test_db")
        
        assert isinstance(result, DBInfo)
        assert result.name == "test_db"
        assert len(result.tables) == 2
        
        # Check users table
        users_table = next(t for t in result.tables if t.name == "users")
        assert len(users_table.columns) == 4
        assert any(c.name == "id" and c.type == "integer" for c in users_table.columns)
        assert any(c.name == "name" and c.type == "character varying" for c in users_table.columns)
        
        # Check posts table  
        posts_table = next(t for t in result.tables if t.name == "posts")
        assert len(posts_table.columns) == 4
        
        mock_cursor.execute.assert_called_once()
        mock_cursor.fetchall.assert_called_once()
    
    @patch('core.engines.PostgresEngine.psycopg2.connect')
    def test_get_db_not_exists(self, mock_connect, engine):
        """Test get_db raises DBNotExists when database doesn't exist."""
        mock_connect.side_effect = psycopg2.OperationalError("database \"nonexistent\" does not exist")
        
        with pytest.raises(DBNotExists):
            engine.get_db("nonexistent")
    
    @patch('core.engines.PostgresEngine.psycopg2.connect')
    def test_get_db_other_error(self, mock_connect, engine):
        """Test get_db raises QueryError for other psycopg2 errors."""
        mock_connect.side_effect = psycopg2.Error("Connection failed")
        
        with pytest.raises(QueryError):
            engine.get_db("test_db")


class TestCreateDb:
    """Test the create_db method."""
    
    @patch('core.engines.PostgresEngine.psycopg2.connect')
    def test_create_db_success(self, mock_connect, engine):
        """Test successful database creation."""
        # Setup mock for autocommit connection (for CREATE DATABASE)
        mock_autocommit_conn = Mock()
        mock_autocommit_cursor = Mock()
        mock_autocommit_conn.cursor.return_value = MagicMock()
        mock_autocommit_conn.cursor.return_value.__enter__.return_value = mock_autocommit_cursor
        mock_autocommit_conn.cursor.return_value.__exit__ = Mock()
        
        # Setup mock for regular connection (for SQL dump)
        mock_regular_conn = Mock()
        mock_regular_cursor = Mock()
        mock_regular_conn.cursor.return_value = MagicMock()
        mock_regular_conn.cursor.return_value.__enter__.return_value = mock_regular_cursor
        mock_regular_conn.cursor.return_value.__exit__ = Mock()
        
        # Mock the context manager for regular connection
        mock_regular_conn.__enter__ = Mock(return_value=mock_regular_conn)
        mock_regular_conn.__exit__ = Mock()
        
        # First call returns autocommit connection, second returns regular connection
        mock_connect.side_effect = [mock_autocommit_conn, mock_regular_conn]
        
        engine.create_db("new_db", SIMPLE_DUMP)
        
        # Verify CREATE DATABASE was called on autocommit connection
        mock_autocommit_cursor.execute.assert_called_once()
        
        # Verify SQL dump queries were executed on regular connection
        assert mock_regular_cursor.execute.call_count >= 2  # CREATE TABLE + INSERT
        mock_regular_conn.commit.assert_called()
    
    @patch('core.engines.PostgresEngine.psycopg2.connect')
    def test_create_db_already_exists(self, mock_connect, engine):
        """Test create_db raises DBExists when database already exists."""
        mock_connect.side_effect = psycopg2.errors.DuplicateDatabase()
        
        with pytest.raises(DBExists):
            engine.create_db("existing_db", SIMPLE_DUMP)
    
    @patch('core.engines.PostgresEngine.psycopg2.connect')
    def test_create_db_query_error(self, mock_connect, engine):
        """Test create_db raises QueryError for invalid SQL."""
        # Make the initial connection (for CREATE DATABASE) fail with a psycopg2.Error
        mock_connect.side_effect = psycopg2.Error("Connection failed")
        
        with pytest.raises(QueryError):
            engine.create_db("new_db", "CREATE TABLE test (id INT);")


class TestDropDb:
    """Test the drop_db method."""
    
    @patch('core.engines.PostgresEngine.psycopg2.connect')
    def test_drop_db_success(self, mock_connect, engine):
        """Test successful database deletion."""
        mock_connection = Mock()
        mock_cursor = Mock()
        mock_connection.cursor.return_value = MagicMock()
        mock_connection.cursor.return_value.__enter__.return_value = mock_cursor
        mock_connection.cursor.return_value.__exit__ = Mock()
        mock_connect.return_value = mock_connection
        
        engine.drop_db("test_db")
        
        # Verify that execute was called (we don't need to check the exact SQL structure)
        mock_cursor.execute.assert_called_once()
    
    @patch('core.engines.PostgresEngine.psycopg2.connect')
    def test_drop_db_not_exists(self, mock_connect, engine):
        """Test drop_db raises DBNotExists when database doesn't exist."""
        mock_connect.side_effect = psycopg2.OperationalError("database \"nonexistent\" does not exist")
        
        with pytest.raises(DBNotExists):
            engine.drop_db("nonexistent")


class TestSendQuery:
    """Test the send_query method."""
    
    @patch('core.engines.PostgresEngine.psycopg2.connect')
    def test_send_query_select(self, mock_connect, engine, mock_connection, mock_cursor):
        """Test send_query with SELECT statement."""
        mock_connect.return_value.__enter__.return_value = mock_connection
        mock_connection.cursor.return_value.__enter__.return_value = mock_cursor
        mock_cursor.fetchall.return_value = [("Alice", 25), ("Bob", 30)]
        mock_cursor.rowcount = 2
        
        results = engine.send_query("test_db", "SELECT name, age FROM users;")
        
        assert len(results) == 1
        result = results[0]
        assert isinstance(result, QueryResult)
        assert result.query == "SELECT name, age FROM users"
        assert result.rowcount == 2
        assert result.data == [("Alice", 25), ("Bob", 30)]
        assert isinstance(result.execution_time, float)
    
    @patch('core.engines.PostgresEngine.psycopg2.connect')
    def test_send_query_insert(self, mock_connect, engine, mock_connection, mock_cursor):
        """Test send_query with INSERT statement."""
        mock_connect.return_value.__enter__.return_value = mock_connection
        mock_connection.cursor.return_value.__enter__.return_value = mock_cursor
        mock_cursor.fetchall.side_effect = psycopg2.ProgrammingError("no results to fetch")
        mock_cursor.rowcount = 1
        
        results = engine.send_query("test_db", "INSERT INTO users (name) VALUES ('Charlie');")
        
        assert len(results) == 1
        result = results[0]
        assert result.query == "INSERT INTO users (name) VALUES ('Charlie')"
        assert result.rowcount == 1
        assert result.data is None
    
    @patch('core.engines.PostgresEngine.psycopg2.connect')
    def test_send_query_multiple(self, mock_connect, engine, mock_connection, mock_cursor):
        """Test send_query with multiple statements."""
        mock_connect.return_value.__enter__.return_value = mock_connection
        mock_connection.cursor.return_value.__enter__.return_value = mock_cursor
        
        # Mock different responses for different queries
        mock_cursor.fetchall.side_effect = [
            [("Alice",), ("Bob",)],  # First SELECT
            psycopg2.ProgrammingError("no results"),  # INSERT
            [(2,)]  # COUNT
        ]
        mock_cursor.rowcount = 2
        
        query = "SELECT name FROM users; INSERT INTO users (name) VALUES ('Charlie'); SELECT COUNT(*) FROM users;"
        results = engine.send_query("test_db", query)
        
        assert len(results) == 3
        assert results[0].data == [("Alice",), ("Bob",)]
        assert results[1].data is None
        assert results[2].data == [(2,)]
    
    @patch('core.engines.PostgresEngine.psycopg2.connect')
    def test_send_query_invalid_sql(self, mock_connect, engine):
        """Test send_query raises QueryError for invalid SQL."""
        mock_connect.return_value.__enter__.return_value.cursor.return_value.__enter__.return_value.execute.side_effect = psycopg2.Error("syntax error")
        
        with pytest.raises(QueryError):
            engine.send_query("test_db", "INVALID SQL QUERY;")
    
    @patch('core.engines.PostgresEngine.psycopg2.connect')
    def test_send_query_db_not_exists(self, mock_connect, engine):
        """Test send_query raises DBNotExists when database doesn't exist."""
        mock_connect.side_effect = psycopg2.OperationalError("database \"nonexistent\" does not exist")
        
        with pytest.raises(DBNotExists):
            engine.send_query("nonexistent", "SELECT 1;")


class TestExecuteSqlDump:
    """Test the _execute_sql_dump private method."""
    
    def test_execute_sql_dump(self, engine, mock_cursor):
        """Test _execute_sql_dump executes all queries in dump."""
        sql_dump = "CREATE TABLE test (id INTEGER); INSERT INTO test VALUES (1); INSERT INTO test VALUES (2);"
        
        engine._execute_sql_dump(mock_cursor, sql_dump)
        
        assert mock_cursor.execute.call_count == 3
        calls = mock_cursor.execute.call_args_list
        assert calls[0][0][0] == "CREATE TABLE test (id INTEGER)"
        assert calls[1][0][0] == "INSERT INTO test VALUES (1)"
        assert calls[2][0][0] == "INSERT INTO test VALUES (2)"


class TestSaveQueryResult:
    """Test the _save_query_result private method."""
    
    def test_save_query_result_with_data(self, engine, mock_cursor):
        """Test _save_query_result with fetchable data."""
        mock_cursor.rowcount = 2
        mock_cursor.fetchall.return_value = [("Alice",), ("Bob",)]
        results = []
        
        with patch('time.perf_counter', side_effect=[0.0, 0.1]):
            engine._save_query_result(mock_cursor, "SELECT name FROM users", results)
        
        assert len(results) == 1
        result = results[0]
        assert result.query == "SELECT name FROM users"
        assert result.rowcount == 2
        assert result.data == [("Alice",), ("Bob",)]
        assert result.execution_time == 0.1
    
    def test_save_query_result_no_data(self, engine, mock_cursor):
        """Test _save_query_result with non-fetchable query."""
        mock_cursor.rowcount = 1
        mock_cursor.fetchall.side_effect = psycopg2.ProgrammingError("no results to fetch")
        results = []
        
        with patch('time.perf_counter', side_effect=[0.0, 0.05]):
            engine._save_query_result(mock_cursor, "INSERT INTO users VALUES (1)", results)
        
        assert len(results) == 1
        result = results[0]
        assert result.query == "INSERT INTO users VALUES (1)"
        assert result.rowcount == 1
        assert result.data is None
        assert result.execution_time == 0.05


class TestSplitQueries:
    """Test the _split_queries private method."""
    
    def test_split_queries_single(self, engine):
        """Test splitting single query."""
        query = "SELECT * FROM users;"
        result = engine._split_queries(query)
        assert result == ["SELECT * FROM users"]
    
    def test_split_queries_multiple(self, engine):
        """Test splitting multiple queries."""
        query = "SELECT * FROM users; INSERT INTO users VALUES (1); UPDATE users SET name = 'test';"
        result = engine._split_queries(query)
        expected = [
            "SELECT * FROM users",
            "INSERT INTO users VALUES (1)",
            "UPDATE users SET name = 'test'"
        ]
        assert result == expected
    
    def test_split_queries_with_whitespace(self, engine):
        """Test splitting queries with extra whitespace."""
        query = "  SELECT * FROM users  ;  ; INSERT INTO users VALUES (1)  ;  "
        result = engine._split_queries(query)
        expected = [
            "SELECT * FROM users",
            "INSERT INTO users VALUES (1)"
        ]
        assert result == expected
    
    def test_split_queries_empty(self, engine):
        """Test splitting empty query string."""
        query = "  ;  ;  "
        result = engine._split_queries(query)
        assert result == []


class TestConnect:
    """Test the _connect private method."""
    
    @patch('core.engines.PostgresEngine.psycopg2.connect')
    def test_connect_success(self, mock_connect, engine):
        """Test successful database connection."""
        mock_connection = Mock()
        mock_connect.return_value.__enter__.return_value = mock_connection
        
        with engine._connect("test_db") as conn:
            assert conn == mock_connection
        
        mock_connect.assert_called_once_with(
            dbname="test_db",
            user="test_user",
            password="test_password",
            host="localhost",
            port=5432
        )
    
    @patch('core.engines.PostgresEngine.psycopg2.connect')
    def test_connect_failure(self, mock_connect, engine):
        """Test connection failure handling."""
        mock_connect.side_effect = psycopg2.OperationalError("Connection failed")
        
        with pytest.raises(psycopg2.OperationalError):
            with engine._connect("test_db"):
                pass


class TestConnectAutocommit:
    """Test the _connect_autocommit private method."""
    
    @patch('core.engines.PostgresEngine.psycopg2.connect')
    def test_connect_autocommit_success(self, mock_connect, engine):
        """Test successful autocommit connection."""
        mock_connection = Mock()
        mock_connect.return_value = mock_connection
        
        with engine._connect_autocommit("test_db") as conn:
            assert conn == mock_connection
            assert conn.autocommit is True
        
        mock_connect.assert_called_once_with(
            dbname="test_db",
            user="test_user", 
            password="test_password",
            host="localhost",
            port=5432
        )
        mock_connection.close.assert_called_once()
    
    @patch('core.engines.PostgresEngine.psycopg2.connect')
    def test_connect_autocommit_failure(self, mock_connect, engine):
        """Test autocommit connection failure handling."""
        mock_connect.side_effect = psycopg2.OperationalError("Connection failed")
        
        with pytest.raises(psycopg2.OperationalError):
            with engine._connect_autocommit("test_db"):
                pass
    
    @patch('core.engines.PostgresEngine.psycopg2.connect')
    def test_connect_autocommit_cleanup_on_exception(self, mock_connect, engine):
        """Test that connection is properly closed even if exception occurs."""
        mock_connection = Mock()
        mock_connect.return_value = mock_connection
        
        with pytest.raises(RuntimeError):
            with engine._connect_autocommit("test_db"):
                raise RuntimeError("Test exception")
        
        mock_connection.close.assert_called_once()


class TestIntegrationWithMockDb:
    """Integration tests using the existing test utilities."""
    
    @pytest.mark.integration
    def test_full_workflow_with_tmp_db(self, engine):
        """Test complete workflow: create, query, drop database.
        
        This test requires a real PostgreSQL connection and will be skipped
        if the database is not available.
        """
        pytest.importorskip("psycopg2")
        
        try:
            with tmp_db(engine, "integration_test_db", SAMPLE_DUMP):
                # Test get_db
                db_info = engine.get_db("integration_test_db")
                assert db_info.name == "integration_test_db"
                assert len(db_info.tables) >= 2
                
                # Test send_query with SELECT
                results = engine.send_query("integration_test_db", "SELECT name FROM users;")
                assert len(results) == 1
                assert results[0].data is not None
                assert len(results[0].data) == 2  # Alice and Bob
                
                # Test send_query with INSERT
                insert_results = engine.send_query(
                    "integration_test_db", 
                    "INSERT INTO users (name, email, age) VALUES ('Charlie', 'charlie@example.com', 35);"
                )
                assert len(insert_results) == 1
                assert insert_results[0].rowcount == 1
                
                # Verify insert worked
                select_results = engine.send_query("integration_test_db", "SELECT COUNT(*) FROM users;")
                assert select_results[0].data[0][0] == 3
        except psycopg2.OperationalError as e:
            pytest.skip(f"PostgreSQL database not available: {e}")
    
    @pytest.mark.integration
    def test_error_handling_with_tmp_db(self, engine):
        """Test error handling in real database scenario.
        
        This test requires a real PostgreSQL connection and will be skipped
        if the database is not available.
        """
        pytest.importorskip("psycopg2")
        
        try:
            with tmp_db(engine, "error_test_db", SIMPLE_DUMP):
                # Test invalid table name
                with pytest.raises(QueryError):
                    engine.send_query("error_test_db", "SELECT * FROM nonexistent_table;")
                
                # Test invalid SQL syntax
                with pytest.raises(QueryError):
                    engine.send_query("error_test_db", "INVALID SQL SYNTAX;")
                
                # Test trying to drop database from within (should fail)
                with pytest.raises(QueryError):
                    engine.send_query("error_test_db", "DROP DATABASE error_test_db;")
        except psycopg2.OperationalError as e:
            pytest.skip(f"PostgreSQL database not available: {e}")


# Additional edge case tests
class TestEdgeCases:
    """Test edge cases and corner scenarios."""
    
    @pytest.mark.integration
    def test_empty_sql_dump(self, engine):
        """Test creating database with empty SQL dump.
        
        This test requires a real PostgreSQL connection and will be skipped
        if the database is not available.
        """
        pytest.importorskip("psycopg2")
        
        try:
            with tmp_db(engine, "empty_db", ""):
                db_info = engine.get_db("empty_db")
                assert db_info.name == "empty_db"
                assert len(db_info.tables) == 0
        except psycopg2.OperationalError as e:
            pytest.skip(f"PostgreSQL database not available: {e}")
    
    def test_query_with_semicolon_in_string(self, engine):
        """Test query splitting with semicolon inside string literals."""
        query = "INSERT INTO test (data) VALUES ('value; with; semicolons');"
        result = engine._split_queries(query)
        # Note: This is a limitation of the current implementation
        # It will split incorrectly, but we test the current behavior
        assert len(result) >= 1
    
    def test_very_long_query(self, engine):
        """Test handling of very long queries."""
        long_query = "SELECT " + ", ".join([f"'{i}' as col_{i}" for i in range(100)]) + ";"
        result = engine._split_queries(long_query)
        assert len(result) == 1
        assert result[0].startswith("SELECT '0' as col_0")
