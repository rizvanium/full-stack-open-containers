FROM node:latest

WORKDIR /usr/src/app

COPY --chown=node . .

RUN npm ci

USER node
CMD [ "npm", "start" ]