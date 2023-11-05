FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY . .

ARG BACKEND_URL

ENV REACT_APP_BACKEND_URL=$BACKEND_URL
ENV CI=true

RUN npm ci
RUN npm test
RUN npm run build

FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html