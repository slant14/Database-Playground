# Database-Playground

## Launch/Access instructions
### You can visit [deployed version](https://dbpg.ru)
### Or you can build the app yourself:

1. Clone the repo:
```sh
$ git clone https://github.com/Delta-Software-Innopolis/Database-Playground
$ cd Database-Playground
```
2. In order for app to run you need `.env` and `db.sqlite3`, you can take sample data from the `deploy` directory:
```sh
$ cp deploy/db.sqlite backend/core/db.sqlite3
$ cp deploy/.env.sample .env
```
3. Run the app via `Docker Compose` (Install it [here](https://docs.docker.com/compose/install/)):
```sh
$ docker compose up --build
```
4. Working version should be available at http://localhost:5173

## Architecture
### Static View
#### Components of backend
<img src="docs/architecture/static-view/backend.png" style="height: 20em">

#### Components of Frontend:
Our frontend architecture uses many small single responsibility components combined togheter. This ensures modularity and reusability in the application. 
- Playground Page
<img src="docs/architecture/static-view/frontend_playground.png" style="height: 20em">

- Template Choice Page
<img src="docs/architecture/static-view/frontend_template.png" style="height: 20em">

- Dashboard Page
<img src="docs/architecture/static-view/frontend_topbar.png" style="height: 20em">

### Dynamic View
#### Sequence Diagram of Main Backend Workflows
These scenarios executes almost instantly, as each of them is mostly IO bound tasks
<img src="docs/architecture/dynamic-view/sequence_diagram.png">

### Deployment View
<img src="docs/architecture/deployment-view/deployment_diagram.png">

## Build and deployment
### Continuous Integration
- [backend.yml](https://github.com/Delta-Software-Innopolis/Database-Playground/blob/pre-chroma/.github/workflows/backend.yml):
  - isort - sorting imports for easier readability
  - flake8 - linter for python code
  - pytest (via script) - run unit tests for the app
- [frontend.yml](https://github.com/Delta-Software-Innopolis/Database-Playground/blob/pre-chroma/.github/workflows/frontend.yml):
  - ESLint - linter for JavaScript code
  - Prettier - formatter for JavaScript and CSS
  - Dependency cruiser - Validating frontend code dependencies
- [deploy.yml](https://github.com/Delta-Software-Innopolis/Database-Playground/blob/pre-chroma/.github/workflows/deploy.yml):
  - Github - to fetch the newest version of the code and run this workflow
  - SSH - to connect to the server and deploy
  - Docker Compose - to easily build and run code
  - [All workflow runs](https://github.com/Delta-Software-Innopolis/Database-Playground/actions)

## Quality Assurance
### Quality attribute scenarios
[Link](https://github.com/Delta-Software-Innopolis/Database-Playground/blob/pre-chroma/docs/quality-assurance/quality-attribute-scenarios.md) for quality attribute scenarios

### Automated tests
Backend testing is done via PyTest package
Mainly, Integration testing is implemented, to check how program works in bound with exact database management systems (e.g PostgreSQL or MongoDB)
Unit tests are implemented to, to check some inner logic (e.g query parsing for MongoEngine)

All the tests are in [backend/tests](backend/tests) directory
The integration tests are marked with special decorator (@integration_test)
The decorator skips the test if INTEGRATION_TEST environment variable is not set or set false

Testing pipeline should be activated with scripts in [backend/scripts](backend/scripts) directory

```shell
# make sure to activate python virtual environment 
# and install required packages

cd backend
./scripts/run_unit_tests.sh  # runs pytest without INTEGRATION_TEST env var


# If you want to run integration testing

docker compose up -d
./scripts/run/all_tests.sh  # runs pytest with INTEGRATION_TEST env var
```
