# Database-Playground
## Development
### Kanban board
[The board ](https://github.com/orgs/S25-SWP-Team46/projects/1/views/3)shows the current iteration.
### Git workflow

We use a simplified workflow inspired by GitHub Flow:

- All work happens in separate branches created from `main`.
- Branch names are chosen freely (`front`, `back`, `db`, etc.).
- Issues are created using templates (and labels):  
  [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE)
- Commit messages must be clear and reference issues if needed.
- When work is done:
  - Push your branch.
  - Create a Pull Request to `main` using the template: 
  - [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md)
  - Request a review.
- Merge only after approvals and passing tests in `main`.
- Close related issues after merging and delete branch.

---
#### Creating issues  
All issues may be created using one of our issue templates, located in [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE):  
- [User Story  ](https://github.com/S25-SWP-Team46/DP-fork/blob/main/.github/ISSUE_TEMPLATE/backlog-bug-report.yml)
- [Bug Report](https://github.com/S25-SWP-Team46/DP-fork/blob/main/.github/ISSUE_TEMPLATE/backlog-user-story.yml)
- [Technical Task](https://github.com/S25-SWP-Team46/DP-fork/blob/main/.github/ISSUE_TEMPLATE/task.yml)

Each template enforces the required fields (e.g., GIVEN/WHEN/THEN for user stories; steps, expected & actual behavior for bugs; subtasks checklist for technical tasks).

---
#### Labelling issues  
We use these labels to organize work and trigger workflows:  
- `enhancement` — new functionality 
- `User Story` — new functionality from the customers view
- `bug` — defect reports  
- `wontfix` — suggestions to improvement
- `release` — end point of some functionality or task
- `good first issue` - if it is necessary to start do some actions, but PM do not knows which exactly, because of it is not his own area of knowledges

---
#### Assigning issues  
The issue author assigns the issue to the developer responsible, or to the team lead if unassigned. Assigns must acknowledge ownership by leaving a comment within 24 hours.

---
### Secrets management
The Django secret key, necessary to run Django app and the SSH key, server IP, USER name, necessary to connect the remote server are handling in the Secrets space.

---

## Quality assurance
### Quality attribute scenarios
[`quality-attribute-scenarios.md`] (https://github.com/S25-SWP-Team46/DP-fork/blob/main/docs/quality-assurance/quality-attribute-scenarios.md)

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
- `pytest` — runs backend unit tests for `PostgresEngine` methods using mocks to verify correctness in isolation.
[Unit tests workflow file](.github/workflows/db-tests.yml)
- `Django Tests framework` — runs integration tests to check Django app functionality end-to-end.
[Integration tests workflow file](.github/workflows/django-tests.yml)
- `flake8` — performs static analysis to enforce code style and detect potential errors.
[Linting workflow file](.github/workflows/lint-and-test.yml)
[Quick linting workflow file](.github/workflows/quick-lint.yml)

---
### Continuous Deployment

**Workflow file:**
- [Deploy workflow](.github/workflows/deploy.yml)

**Description:**
This workflow deploys the project to the production server over SSH. It includes:

- Checking and installing Docker if it is not present.
- Checking and installing Docker Compose if it is not present.
- Cloning the repository or updating it to the latest `main` branch.
- Stopping existing containers.
- Rebuilding Docker images with environment arguments.
- Starting the updated containers in detached mode.

**Trigger:**
- Manual trigger via `workflow_dispatch`.

**Secrets used:**
- `SERVER_IP` — target server IP address.
- `SERVER_USERNAME` — SSH user.
- `SERVER_SSH_KEY` — SSH private key for authentication.

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

#### Conclusion

With its modular layers, strong cohesion, and loose coupling, Database Playground offers a maintainable, scalable foundation—further reinforced by containerized deployment and automated CI/CD.


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


