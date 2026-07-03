FROM node:20-alpine AS build

WORKDIR /app

ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV npm_config_strict_ssl=false

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN ./node_modules/.bin/tsc

FROM node:20-alpine

WORKDIR /app

ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV npm_config_strict_ssl=false

COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/app.js"]
