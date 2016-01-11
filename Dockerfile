FROM node:0.12.7
MAINTAINER summer <qinglin9@gmail.com>

COPY app ./usr/src/app
WORKDIR /usr/src/app

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
