import os
import sys
import pytest

# Add the core directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'core'))

# Optional: Set up test database configuration
os.environ.setdefault('POSTGRES_USER', 'test_user')
os.environ.setdefault('POSTGRES_PASSWORD', 'test_password')

@pytest.fixture(scope="session", autouse=True)
def setup_test_environment():
    """Set up the test environment."""
    # Any global test setup can go here
    yield
    # Any global test cleanup can go here
