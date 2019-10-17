// Author: @lzontar
const express = require('express')
const database = require('./database')
const logger = require('../logging/logger')
const server = express()

server.use(express.json())

let neoSession = null;

server.get('/', function (req, res) {
  res.status(200).json({
    status: 'OK'
  })
})

server.get('/api/id/:imdbId', (req, res) => {
  logger.info('Request parameters: ' + req.params['imdbId'])

  dbResult = database.matchMovieRecommendationsById(neoSession, req.params['imdbId'], function(dbResult, status) {
    logger.info(JSON.stringify(dbResult));
    res.status(status).json(dbResult)
  });
})

server.get('/api/title/:title/:released', (req, res) => {
  logger.info('Request parameters: ' + req.params['title'] + ', ' + req.params['released'])

  dbResult = database.matchMovieRecommendationsByTitle(neoSession, req.params['title'], req.params['released'],function(dbResult, status) {
    logger.info(JSON.stringify(dbResult));
    res.status(status).json(dbResult)
  });
})

server.post('/api/post/id', (req, res) => {
  logger.info('Request body: ' + JSON.stringify(req.body))

  dbResult = database.postPromotionById(neoSession, req, function(dbResult, status) {
    logger.info(JSON.stringify(dbResult));
    res.status(status).json(dbResult)
  });
})

server.post('/api/post/title/year', (req, res) => {
  logger.info('Request body: ' + JSON.stringify(req.body))

  dbResult = database.postPromotionByTitle(neoSession, req, function(dbResult, status) {
    logger.info(JSON.stringify(dbResult));
    res.status(status).json(dbResult)
  });
})

server.listen(3000, () =>
  {
    const neoDriver = database.connectDB('bolt://localhost:7687');
    neoSession = neoDriver.session();
  }
);

module.exports = server
