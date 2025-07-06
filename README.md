# Database-Playground
## Development
### Kanban board
[The board ](https://github.com/orgs/S25-SWP-Team46/projects/1/views/3)shows the current iteration.

---  
### Git workflow

We use a simplified workflow inspired by GitHub Flow:

- All work happens in separate branches created from `main`.
- Branch names are chosen freely (`front`, `back`, `db`, etc.).
- Issues are created using templates:  
  [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE)`](.github/ISSUE_TEMPLATE):  
	- [User Story  ](https://github.com/S25-SWP-Team46/DP-fork/blob/main/.github/ISSUE_TEMPLATE/backlog-bug-report.yml)
	- [Bug Report](https://github.com/S25-SWP-Team46/DP-fork/blob/main/.github/ISSUE_TEMPLATE/backlog-user-story.yml)
	- [Technical Task](https://github.com/S25-SWP-Team46/DP-fork/blob/main/.github/ISSUE_TEMPLATE/task.yml)  
and labels:
	- `enhancement` — new functionality 
	- `User Story` — new functionality from the customers view
	- `bug` — defect reports  
	- `wontfix` — suggestions to improvement
	- `release` — end point of some functionality or task
	- `good first issue` - if it is necessary to start do some actions, but PM do not knows which exactly, because of it is not his own area of knowledges  
	Assignment policy:
		The issue author assigns the issue to the developer responsible, or to the team lead if unassigned. Assigns must acknowledge ownership by leaving a comment within 24 hours.
- Commit messages must be clear and reference issues if needed.
- When work is done:
  - Push your branch.
  - Create a Pull Request to `main` using the template: 
  - [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md)
  - Request a review.
- Review policy: global merge requests approving by customer's review
- Merge only after approvals and passing tests in `main`.
- Close related issues after merging and delete branch.  
- [GitGraph](./docs/photo_2025-07-06_04-35-49.jpg)  

---
### Secrets management
The Django secret key, necessary to run Django app and the SSH key, server IP, USER name, necessary to connect the remote server are handling in the Secrets space.

---

## Quality assurance
### Quality attribute scenarios
[`quality-attribute-scenarios.md`](https://github.com/S25-SWP-Team46/DP-fork/blob/main/docs/quality-assurance/quality-attribute-scenarios.md)

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

### User acceptance tests

[`user-acceptance-tests`](https://github.com/S25-SWP-Team46/DP-fork/blob/main/docs/quality-assurance/user-acceptance-tests.md)

## Build and deployment
[Pull request](https://github.com/S25-SWP-Team46/DP-fork/pull/147), where CI/CD can be seen

### Continuous Integration
[lint-and-test.yml](.github/workflows/lint-and-test.yml)
This workflow performs static analysis and testing. The lint job uses flake8 with plugins (flake8-import-order, flake8-docstrings, flake8-bugbear) for code style, errors, and complexity. The test job uses pytest for unit tests, pytest-cov for code coverage, and actions/upload-artifact to save reports.

[django-tests.yml](.github/workflows/django-tests.yml)
This workflow tests the Django application. It uses Django's manage.py test to run tests against a PostgreSQL service container. actions/cache caches Python dependencies for faster runs.

[db-tests.yml](.github/workflows/db-tests.yml)
This workflow focuses on database engine unit tests. pytest runs unit tests from test_postgres_engine.py, specifically excluding integration tests. A PostgreSQL service is available, and actions/cache speeds up dependency setup.

[quick-lint.yml](.github/workflows/quick-lint.yml)
This lightweight workflow is solely for static analysis. flake8 checks for critical syntax errors (failing the workflow) and reports other style issues as warnings.

---

### Continuous Deployment
[`deploy.yml`](.github/workflows/deploy.yml)

Used tools:
- **Docker** is the containerization platform that runs our applications on the server. Our script ensures it's installed and builds the project with docker-compose on the server
- **GitHub Actions** lets to run a script to automatically clone the repository to our server and run docker-compose after a push to the main branch or by clicking a button. GitHub allows for additional criteria to be configured, such as passing CI tests.

All CD workflow runs can be seen [here](https://github.com/S25-SWP-Team46/DP-fork/actions/workflows/deploy.yml)

---
### Manual deployment

To deploy the project locally:  
docker-compose up --build

To deploy the project on the server:  
docker-compose build --build-arg REACT_APP_API_URL=http://your-server-ip:8000  
docker-compose up  

---

## Architecture

### Static view

[`static-view`](./docs/architecture/static-view/)

Database Playground is an educational platform for interactive database learning, featuring a **React**frontend and **Django** backend. It supports **PostgreSQL**, **ChromaDB**, and **SQLite**, and is deployed via **Docker Compose** with CI/CD automated by **GitHub Actions**.

#### Architectural Layers

The frontend’s App component handles global state and routing, with page modules (Home, Classrooms, ExactClassroom, Account, Template), an interactive Code Editor, and specialized ChromaDB and PostgreSQL UI components. A utility layer provides API clients and helpers. The backend offers REST endpoints in Django, delegates domain logic to service modules (accounts, classrooms, schemas), and uses a Database Engines adapter for multi‑DB support.

#### Deployment Architecture

Docker Compose isolates frontend, backend and databases with environment‑specific configs. A GitHub Actions workflow runs tests (pytest, Django tests) and flake8 linting on main‑branch pushes before deployment.

#### Coupling and Cohesion

Clean REST interfaces and a database adapter pattern ensure loose coupling; containerization further isolates services. High cohesion is achieved by single‑responsibility React components and domain‑focused backend services.

#### Maintainability (ISO 25010)

- **Modularity**  
  Clear layering between frontend, backend, and utility modules; pluggable Database Engines adapters allow individual components to be extended or replaced with minimal ripple effects.

- **Reusability**  
  Centralized API abstraction and utility functions; database‑specific UI components (ChromaState, PostgresState) designed for reuse across multiple views.

- **Analysability**  
  Consistent file/folder structure, clear naming conventions, comprehensive README documentation and quality‑attribute scenarios; CI/CD logs provide transparent build and test reporting.

- **Modifiability**  
  React’s component‑based design localizes UI changes; Django service‑layer abstractions contain backend modifications; Docker Compose configurations isolate environment‑specific adjustments.

- **Testability**  
  Robust backend test suite (pytest + Django TestCase) and automated linting (flake8) integrated into GitHub Actions; each service container can be spun up in isolation for targeted integration tests.

### Dynamic view

[dynamic-view](https://github.com/S25-SWP-Team46/DP-fork/tree/main/docs/architecture/deployment-view)

All measurements were taken in a production‐like environment (React frontend, Dockerized Django backend, AWS RDS PostgreSQL):

#### Performance Metrics
- **User Authentication:** 120–200 ms
- **Cookie initialization**: 50-60 ms
- **PostgreSQL Schema Fetch:** 150–250 ms
- **Chroma command Execution:** 250–500 ms
- **PostgreSQL command Execution:** 200–400 ms
- **Token refresh:** 10-15 ms

### Deployment view

[`deployment-view`](./docs/architecture/deployment-view)

The project is deployed in Yandex Cloud on an Ubuntu 24.04 server using Docker containers, with GitHub Actions automating the CI/CD process. Customers access the "Frontend" via a web browser over the Internet. For customers to run the project on their own server, they must add their server's username, IP address, and SSH key to GitHub secrets and then trigger the "Deploy Project" workflow. The "Frontend" communicates with the "Backend" via RestAPI, which in turn interacts with "Backend-DB," "Chroma," "Postgres," "MySQL," and "MongoDB," all running securely within Docker on the server.

## Usage 
### EXISTED USER - w/o admin panel
Go to http://89.169.178.180:3000/ and login with 
Login: 
```
Leonid
```
Password: 
```
123456
```
Then go to 
1) Classrooms -> View
2) Templates -> 
	-> Create Template 
	-> Choose DB... (Postgres or Chroma - check Command Tips in the right bottom section) 
	-> write requests and click Run Code 
	-> check DB changes in real time, check execution measuring in the Request Result field. 


---
### NEW USER - admin usage
#### Registration usability
- Enter the main page of the application ->
	- -> select the ``Sign in`` button -> after which a modal window opens for login (if you enter the data of an unregistered user, an error will be displayed). Therefore, the next step:
		- -> select the registration option on the model window  -> enter the requested data (name and email are unique for each user, the email must correspond to the standard form and the passwords must match). 
- Next -> go to the account tab, where your name will be displayed. The following steps are required to verify registration: 
	1. In the account tab, click on ``Log Out`` then -> on the main page of the message with the previously entered name and password.  
	2. Log in to the admin panel at http://89.169.178.180:8000/admin/ -> enter name: **admin**, password: **admin**. Next -> go to the Users field in the db structure -> you will see the newly registered user.
#### Classroom usability
- Without leaving the admin page -> go to the Classrooms field then -> click on the add classroom button. 
- Next -> fill all the necessary fields -> create a class by clicking on the ``Save button`` **!(TA (Teacher Assistant) can only be the user who has the TA role set in the user settings!**
- In order to set the role -> go to the users field -> select the user -> select Teacher Assistant in the role field). 
- After successfully creating the class -> open the Enrollment field -> create a new Enrollment -> you need to select: 
	- the user you want to add (for example, add yourself)
	- the class you want to add the user to
	- the rating you want to assign to the user.
- After successfully creating an Enrollment -> log back in to http://89.169.178.180:3000/ -> update (or chose) the class page -> you will see the class you just added yourself to.
