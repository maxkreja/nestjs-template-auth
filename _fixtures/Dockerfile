FROM node:16-alpine

RUN mkdir /app && chown node:node /app
RUN mkdir /app/node_modules && chown node:node /app/node_modules

RUN npm i -g @nestjs/cli

WORKDIR /app

USER node
EXPOSE 3000
