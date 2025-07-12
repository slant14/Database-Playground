### Continuous Integration
[lint-and-test.yml](../../.github/workflows/lint-and-test.yml)
This workflow performs static analysis and testing. The lint job uses flake8 with plugins (flake8-import-order, flake8-docstrings, flake8-bugbear) for code style, errors, and complexity. The test job uses pytest for unit tests, pytest-cov for code coverage, and actions/upload-artifact to save reports.

[django-tests.yml](../../.github/workflows/django-tests.yml)
This workflow tests the Django application. It uses Django's manage.py test to run tests against a PostgreSQL service container. actions/cache caches Python dependencies for faster runs.

[db-tests.yml](../../.github/workflows/db-tests.yml)
This workflow focuses on database engine unit tests. pytest runs unit tests from test_postgres_engine.py, specifically excluding integration tests. A PostgreSQL service is available, and actions/cache speeds up dependency setup.

[quick-lint.yml](../../.github/workflows/quick-lint.yml)
This lightweight workflow is solely for static analysis. flake8 checks for critical syntax errors (failing the workflow) and reports other style issues as warnings.
