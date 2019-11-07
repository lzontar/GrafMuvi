// Author: @lzontar
const express = require('express')
const database = require('./database')

const logger = require('../logging/logger')

const GrafMuvi = require('../api.js')
const api = new GrafMuvi()

const app = express()
const port = process.env.PORT || 8080

app.use(express.json())

const neoDriver = database.connectDB()
const neoSession = neoDriver.session()
app.get('/', function (req, res) {
  res.status(200).json({
    status: 'OK',
    example: {
      path: 'http://localhost:8080/api/title/Godfather/1991',
      returnValue: { 1: 'American gangster', 2: 'Black mass', 3: 'Training day' }
    }
  })
})

app.get('/api/id/:imdbId', (req, res) => {
  logger.info('Request parameters: ' + req.params.imdbId)

  database.matchMovieRecommendationsById(neoSession, req.params.imdbId, api, function (dbResult, status) {
    logger.info(JSON.stringify(dbResult))
    res.status(status).json(api.toMovieRecommendationList(dbResult))
  })
})

app.get('/api/title/:title/:released', (req, res) => {
  logger.info('Request parameters: ' + req.params.title + ', ' + req.params.released)

  database.matchMovieRecommendationsByTitle(neoSession, req.params.title, req.params.released, api, function (dbResult, status) {
    logger.info(JSON.stringify(dbResult))
    res.status(status).json(api.toMovieRecommendationList(dbResult))
  })
})

app.post('/api/post/id', (req, res) => {
  logger.info('Request body: ' + JSON.stringify(req.body))

  database.postPromotionById(neoSession, req, api, function (dbResult, status) {
    logger.info(JSON.stringify(dbResult))
    res.status(status).json(api.toRelationship(dbResult))
  })
})

app.post('/api/post/title/year', (req, res) => {
  logger.info('Request body: ' + JSON.stringify(req.body))

  database.postPromotionByTitle(neoSession, req, api, function (dbResult, status) {
    logger.info(JSON.stringify(dbResult))
    res.status(status).json(api.toRelationship(dbResult))
  })
})

const server = app.listen(port, () => {
  console.log('Listening at port ' + port + '...')
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
