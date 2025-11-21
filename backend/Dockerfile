FROM node:alpine

WORKDIR /docker-voting-app/backend

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001
CMD	["node" , "server.js"]
