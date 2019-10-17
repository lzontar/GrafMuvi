// Author: @lzontar
const express = require('express')
const database = require('./database')
const logger = require('../logging/logger')
const app = express()

app.use(express.json())

const neoDriver = database.connectDB('bolt://localhost:7687')
const neoSession = neoDriver.session()

app.get('/', function (req, res) {
  res.status(200).json({
    status: 'OK'
  })
})

app.get('/api/id/:imdbId', (req, res) => {
  logger.info('Request parameters: ' + req.params.imdbId)

  database.matchMovieRecommendationsById(neoSession, req.params.imdbId, function (dbResult, status) {
    logger.info(JSON.stringify(dbResult))
    res.status(200).json({
      1: 'test2',
      2: 'test3',
      3: 'test4'
    })
  })
})

app.get('/api/title/:title/:released', (req, res) => {
  logger.info('Request parameters: ' + req.params.title + ', ' + req.params.released)

  database.matchMovieRecommendationsByTitle(neoSession, req.params.title, req.params.released, function (dbResult, status) {
    logger.info(JSON.stringify(dbResult))
    res.status(200).json({
      1: 'test2',
      2: 'test3',
      3: 'test4'
    })
  })
})

app.post('/api/post/id', (req, res) => {
  logger.info('Request body: ' + JSON.stringify(req.body))

  database.postPromotionById(neoSession, req, function (dbResult, status) {
    logger.info(JSON.stringify(dbResult))
    res.status(200).json({
      id1: '123',
      id2: '456',
      promotions: 101
    })
  })
})

app.post('/api/post/title/year', (req, res) => {
  logger.info('Request body: ' + JSON.stringify(req.body))

  database.postPromotionByTitle(neoSession, req, function (dbResult, status) {
    logger.info(JSON.stringify(dbResult))
    res.status(200).json({
      id1: '123',
      id2: '456',
      promotions: 99
    })
  })
})

const server = app.listen(3000, () => {
}
)
var exportObj = {
  app: app,
  server: server,
  database: {
    driver: neoDriver,
    session: neoSession
  }
}

module.exports = exportObj
