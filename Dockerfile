FROM node:lts-alpine

WORKDIR /api

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY src ./src
COPY tsconfig.json .
COPY .env.production .

RUN pnpm run build

COPY ./dist .

EXPOSE 5200

CMD [ "npm", "start" ]

