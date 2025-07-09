# Database-Playground

To deploy the project locally:<br>
docker-compose up --build

To deploy the project on the server:<br>
docker-compose build --build-arg REACT_APP_API_URL=http://your-server-ip:8000<br>
docker-compose up

If you want to build only frontend:<br>
docker-compose build --build-arg REACT_APP_API_URL=http://your-server-ip:8000 frontend<br>
Then with builded backend: docker-compose up