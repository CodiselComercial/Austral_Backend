FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache bash

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN sed -i 's/\r$//' docker/entrypoint.sh && chmod +x docker/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["bash", "docker/entrypoint.sh"]
