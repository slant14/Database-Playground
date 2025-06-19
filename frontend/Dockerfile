FROM node:16 AS build

ARG REACT_APP_API_URL=http://localhost:8000

WORKDIR /app
COPY . /app

RUN echo "REACT_APP_API_URL=${REACT_APP_API_URL}" > .env

RUN npm install --force && \
    npm run build

RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]