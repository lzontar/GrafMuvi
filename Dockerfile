FROM node:10

RUN mkdir /app

WORKDIR /app

COPY package.json /app
COPY . /app

RUN npm install
RUN npm install -g gulp

CMD ["gulp", "start"]
