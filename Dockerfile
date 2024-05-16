FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY src ./src
COPY tsconfig.json .
COPY .env.production .

RUN npm run build

COPY ./dist .

EXPOSE 5200

CMD [ "npm", "start" ]

