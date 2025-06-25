FROM node:24 AS build

ARG REACT_APP_API_URL=http://localhost:8000

WORKDIR /app
COPY . /app

RUN echo "REACT_APP_API_URL=${REACT_APP_API_URL}" > .env

RUN npm install --force && \
    npm run build

CMD ["npm", "start"]