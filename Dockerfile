FROM node:20

WORKDIR /C242-DT01-API

COPY package*.json .

RUN npm ci

COPY . .

CMD ["npm", "start"]