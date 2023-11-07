FROM node:latest

WORKDIR /usr/src/app

COPY --chown=node . .

RUN npm install

USER node
CMD [ "npm", "run", "dev" ]