// Author: @lzontar
const express = require('express')
const database = require('./database')

const logger = require('../logging/logger')

const graph = require('../structure/graph')

const app = express()

app.use(express.json())

const neoDriver = database.connectDB()
const neoSession = neoDriver.session()
app.get('/', function (req, res) {
  res.status(200).json({
    status: 'OK',
    example: {
      path: 'http://localhost:3000/api/title/Godfather/1991',
      returnValue: { 1: 'American gangster', 2: 'Black mass', 3: 'Training day' }
    }
  })
})

app.get('/api/id/:imdbId', (req, res) => {
  logger.info('Request parameters: ' + req.params.imdbId)

  database.matchMovieRecommendationsById(neoSession, req.params.imdbId, function (dbResult, status) {
    logger.info(JSON.stringify(dbResult))
    res.status(200).json(graph.toMovieRecommendationList(dbResult))
  })
})

app.get('/api/title/:title/:released', (req, res) => {
  logger.info('Request parameters: ' + req.params.title + ', ' + req.params.released)

  database.matchMovieRecommendationsByTitle(neoSession, req.params.title, req.params.released, function (dbResult, status) {
    logger.info(JSON.stringify(dbResult))
    res.status(200).json(graph.toMovieRecommendationList(dbResult))
  })
})

app.post('/api/post/id', (req, res) => {
  logger.info('Request body: ' + JSON.stringify(req.body))

  database.postPromotionById(neoSession, req, function (dbResult, status) {
    logger.info(JSON.stringify(dbResult))
    res.status(200).json(graph.toRelationship(dbResult))
  })
})

app.post('/api/post/title/year', (req, res) => {
  logger.info('Request body: ' + JSON.stringify(req.body))

  database.postPromotionByTitle(neoSession, req, function (dbResult, status) {
    logger.info(JSON.stringify(dbResult))
    res.status(200).json(graph.toRelationship(dbResult))
  })
})

const server = app.listen(process.env.PORT || 5000, () => {}
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
