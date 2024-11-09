# Node.js 서버를 위한 Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8008

CMD ["node", "ListServer.js"]
