FROM node:18.14.2

WORKDIR /usr/src/app

COPY . .

RUN npm install

CMD ["npm", "start"]