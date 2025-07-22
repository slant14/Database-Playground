### Automated tests

Tools used:
- `pytest` — for backend unit tests
- `Django Tests framework` — for backend integration testing
- `flake8` — for code linting

Test types:
- Unit tests — cover all `PostgresEngine` methods using mocks.
- Integration test — verifies some Django app functionality apply successfully.
- Static analysis — checks code quality and style.

Test locations:
- [`./tests/`](https://github.com/S25-SWP-Team46/DP-fork/tree/main/backend/tests) — unit tests 
- [`./backend/core/tests`](https://github.com/S25-SWP-Team46/DP-fork/blob/main/backend/core/tests/) — integration test 
- [`./.flake8`](https://github.com/S25-SWP-Team46/DP-fork/blob/main/.flake8) — linting configuration
