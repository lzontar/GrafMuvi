FROM node:10

RUN mkdir -p /app

WORKDIR /app

COPY . ./

RUN npm install
RUN npm install -g gulp

CMD ["gulp", "start"]
