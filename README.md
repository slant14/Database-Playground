# Database-Playground



To deploy the project locally:<br>
docker-compose up --build

To deploy the project on the server:<br>
docker-compose build --build-arg REACT_APP_API_URL=http://your-server-ip:8000<br>
docker-compose up

If you want to build only frontend:<br>
docker-compose build --build-arg REACT_APP_API_URL=http://your-server-ip:8000 frontend<br>
Then with builded backend: docker-compose up


## Development
### Kanban board
[The board](https://github.com/orgs/S25-SWP-Team46/projects/1/views/3) shows the current iteration.
### Git workflow

Base workflow:  
We are developing the project on Github with following branches structure:
- `main` — always contains production-ready code  
- `develop` — integration branch for completed features and fixes  

---

#### 1. Creating issues  
All issues must be created using one of our issue templates, located in [`.github/ISSUE_TEMPLATE/`](https://github.com/S25-SWP-Team46/DP-fork/tree/main/.github/ISSUE_TEMPLATE):  
- [User Story](https://github.com/S25-SWP-Team46/DP-fork/blob/main/.github/ISSUE_TEMPLATE/backlog-bug-report.yml)
- [Bug Report](https://github.com/S25-SWP-Team46/DP-fork/blob/main/.github/ISSUE_TEMPLATE/backlog-user-story.yml)
- [Technical Task](https://github.com/S25-SWP-Team46/DP-fork/blob/main/.github/ISSUE_TEMPLATE/task.yml)

Each template enforces the required fields (e.g., GIVEN/WHEN/THEN for user stories; steps, expected & actual behavior for bugs; subtasks checklist for technical tasks).

## Quality assurance
### Quality attribute scenarios
`quality-attribute-scenarios.md` https://github.com/S25-SWP-Team46/DP-fork/blob/main/docs/quality-assurance/quality-attribute-scenarios.md

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

## Build and Deployment
### Continuous Deployment
CD `deploy.yml` file - https://github.com/S25-SWP-Team46/DP-fork/blob/main/.github/workflows/deploy.yml

Used tools:
- **Docker** is the containerization platform that runs our applications on the server. Our script ensures it's installed and builds the project with docker-compose on the server
- **GitHub Actions** lets to run a script to automatically clone the repository to our server and run docker-compose after a push to the main branch or by clicking a button. GitHub allows for additional criteria to be configured, such as passing CI tests.

All CD workflow runs can be seen here - https://github.com/S25-SWP-Team46/DP-fork/actions/workflows/deploy.yml




