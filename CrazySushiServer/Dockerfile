FROM node:20-alpine

WORKDIR /app/CrazySushiServer

COPY CrazySushiServer/package*.json ./
RUN npm ci

COPY CrazySushiServer/server ./server
COPY menu /app/menu

EXPOSE 3001

CMD ["npm", "start"]
