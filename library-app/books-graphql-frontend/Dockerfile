FROM node:18.14.2 AS build-stage

WORKDIR /usr/src/app

COPY . .

ENV CI=true

RUN npm ci
RUN npm run build

FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html