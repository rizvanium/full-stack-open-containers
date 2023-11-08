FROM node:18.14.2 AS build-stage

WORKDIR /usr/src/app

COPY . .

ARG BACKEND_URI
ARG WS_BACKEND_URI

ENV REACT_APP_BACKEND_URI=$BACKEND_URI
ENV REACT_WS_APP_BACKEND_URI=$WS_BACKEND_URI
ENV CI=true

RUN npm ci
RUN npm run build

FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html