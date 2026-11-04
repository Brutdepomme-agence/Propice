FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY . .
RUN npm run build

ENV DATA_DIR=/data
VOLUME ["/data"]

EXPOSE 3000
CMD ["node", "server.js"]
