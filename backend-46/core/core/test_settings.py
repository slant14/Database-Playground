"""
Test settings for Django tests - uses SQLite instead of PostgreSQL
"""
from .settings import *

# Override database settings for testing
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# Disable migrations for faster tests
class DisableMigrations:
    def __contains__(self, item):
        return True
    def __getitem__(self, item):
        return None

MIGRATION_MODULES = DisableMigrations()

# Simpler password validation for tests
AUTH_PASSWORD_VALIDATORS = []

# Disable debug for tests
DEBUG = False

# Use local timezone for tests
USE_TZ = False
