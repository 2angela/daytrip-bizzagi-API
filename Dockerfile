FROM node:20-alpine

WORKDIR /C242-DT01-API

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 8080

CMD ["npm", "start"]