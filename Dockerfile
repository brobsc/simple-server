FROM node:alpine

RUN npm i -g yarn

COPY ./ /home/simple-server/
WORKDIR /home/simple-server/
RUN yarn

CMD node /home/simple-server/main.js
