FROM node:0.12.7
MAINTAINER summer <qinglin9@gmail.com>

RUN npm install

VOLUME ["/usr/src/app"]

EXPOSE 4000

WORKDIR /usr/src/app

CMD ["npm", "start"]