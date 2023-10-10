FROM node:13-slim

WORKDIR /app

ADD . /app

CMD npm run build
