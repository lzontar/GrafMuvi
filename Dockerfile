FROM node:10

RUN mkdir -p /app

WORKDIR /app


COPY package.json /app

RUN npm install
RUN npm install -g gulp

COPY . /app

EXPOSE 8080

CMD ["gulp", "start"]
