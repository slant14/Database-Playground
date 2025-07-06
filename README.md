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
[The board ](https://github.com/orgs/S25-SWP-Team46/projects/1/views/3)shows the current iteration.
### Git workflow

Base workflow:  
We are developing the project on Github with following branches structure:
- `main` — always contains production-ready code  
- `develop` — integration branch for completed features and fixes  

---

#### 1. Creating issues  
All issues must be created using one of our issue templates, located in [`.github/ISSUE_TEMPLATE/`]((https://github.com/S25-SWP-Team46/DP-fork/tree/main/.github/ISSUE_TEMPLATE):  
- [User Story  ](https://github.com/S25-SWP-Team46/DP-fork/blob/main/.github/ISSUE_TEMPLATE/backlog-bug-report.yml)
- [Bug Report](https://github.com/S25-SWP-Team46/DP-fork/blob/main/.github/ISSUE_TEMPLATE/backlog-user-story.yml)
- [Technical Task](https://github.com/S25-SWP-Team46/DP-fork/blob/main/.github/ISSUE_TEMPLATE/task.yml)

Each template enforces the required fields (e.g., GIVEN/WHEN/THEN for user stories; steps, expected & actual behavior for bugs; subtasks checklist for technical tasks).

### TESTING 
`.github/ISSUE_TEMPLATE/`
