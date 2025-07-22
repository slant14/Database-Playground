# PostgresEngine Unit Tests

This directory contains comprehensive unit tests for all functions in the `PostgresEngine` class.

## Test Coverage

The test suite includes tests for all public and private methods of the `PostgresEngine` class:

### Public Methods
- `get_db(db_name)` - Retrieve database schema information
- `create_db(db_name, sql_dump)` - Create database and execute SQL dump
- `drop_db(db_name)` - Delete database
- `send_query(db_name, full_query)` - Execute SQL queries

### Private Methods
- `_execute_sql_dump(cursor, sql_dump)` - Execute SQL dump queries
- `_save_query_result(cursor, query, results)` - Save query execution results
- `_split_queries(big_query)` - Split multi-query strings
- `_connect(db_name)` - Create database connection
- `_connect_autocommit(db_name)` - Create autocommit database connection

## Test Categories

### 1. Unit Tests (28 tests)
These tests use mocks and don't require a real database connection. They test:
- Method logic and behavior
- Error handling and exception mapping
- Input validation
- Query splitting and result processing

### 2. Integration Tests (3 tests) 
These tests require a real PostgreSQL database connection and are marked with `@pytest.mark.integration`. They test:
- End-to-end database operations
- Real SQL execution
- Database state management

## Running the Tests

### Run All Unit Tests (Recommended)
```bash
pytest tests/test_postgres_engine.py -m "not integration" -v
```

### Run All Tests (Including Integration)
```bash
pytest tests/test_postgres_engine.py -v
```

### Run Specific Test Class
```bash
pytest tests/test_postgres_engine.py::TestGetDb -v
```

### Run Single Test
```bash
pytest tests/test_postgres_engine.py::TestGetDb::test_get_db_success -v
```

## Requirements

- pytest
- psycopg2-binary
- python-decouple

## Test Structure

Tests are organized into logical classes:
- `TestPostgresEngineInit` - Constructor tests
- `TestGetDb` - Database schema retrieval tests
- `TestCreateDb` - Database creation tests
- `TestDropDb` - Database deletion tests
- `TestSendQuery` - Query execution tests
- `TestExecuteSqlDump` - SQL dump execution tests
- `TestSaveQueryResult` - Result processing tests
- `TestSplitQueries` - Query parsing tests
- `TestConnect` - Connection management tests
- `TestConnectAutocommit` - Autocommit connection tests
- `TestIntegrationWithMockDb` - Integration tests
- `TestEdgeCases` - Edge case and corner scenario tests

## Mock Strategy

Unit tests use extensive mocking to:
- Isolate the code under test
- Avoid real database dependencies
- Test error conditions safely
- Ensure fast test execution

Integration tests use the existing `postgres_tmp_db` utility for safe database operations.
