FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci || npm install

COPY . .
RUN npm run build && npm prune --omit=dev

ENV DATA_DIR=/data
VOLUME ["/data"]

EXPOSE 3000
CMD ["node", "server.js"]
