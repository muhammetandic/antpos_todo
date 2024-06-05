FROM node:lts-alpine as build

EXPOSE 5200

WORKDIR /api

COPY package*.json ./

RUN npm install -g pnpm
RUN pnpm install

COPY src ./src
COPY tsconfig.json .

RUN pnpm run build

CMD [ "npm", "start" ]

