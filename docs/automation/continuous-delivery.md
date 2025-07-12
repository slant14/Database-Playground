### Continuous Deployment
[`deploy.yml`](.github/workflows/deploy.yml)

Used tools:
- **Docker** is the containerization platform that runs our applications on the server. Our script ensures it's installed and builds the project with docker-compose on the server
- **GitHub Actions** lets to run a script to automatically clone the repository to our server and run docker-compose after a push to the main branch or by clicking a button. GitHub allows for additional criteria to be configured, such as passing CI tests.

All CD workflow runs can be seen [here](https://github.com/S25-SWP-Team46/DP-fork/actions/workflows/deploy.yml)
