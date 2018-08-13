FROM node:alpine

RUN npm i -g yarn

WORKDIR /home/simple-server/
RUN echo package.json
RUN yarn

CMD node /home/simple-server/main.js
