// Author: @lzontar
const express = require('express')
const database = require('./src/api/database')

const logger = require('./src/logging/logger')

const GrafMuvi = require('./src/api.js')
const api = new GrafMuvi()

const app = express()
const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080
const ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'

app.use(express.json())

app.get('/status', function (req, res) {
  res.status(200).json({
    status: 'OK',
    ejemplo: {
      ruta: 'https://grafmuvi.herokuapp.com/api/title/The godfather/1972',
      valor: "{JSON: { 1: 'American gangster', 2: 'Black mass', 3: 'Training day' }}"
    }
  })
})

const neoDriver = database.connectDB()
const neoSession = neoDriver.session()
app.get('/', function (req, res) {
  res.status(200).json({
    status: 'OK',
    ejemplo: {
      ruta: 'https://grafmuvi.herokuapp.com/api/title/The godfather/1972',
      valor: "{JSON: { 1: 'American gangster', 2: 'Black mass', 3: 'Training day' }}"
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

    if (status === 200) {
      dbResult = api.toRelationship(dbResult)
      res.status(status).json(dbResult)
    } else if (status === 400) {
      dbResult = {
        errorCode: 400,
        description: "Rules listed under key 'rules' are not considered in your request. Check your request!",
        rules: {
          1: "Plots shouldn't be too different from each other (checked with word embedding method and cosine similarity function)",
          2: 'Genres are connected to each other. Using these connections genres should be connected through at most 1 node (distance(node1, node2) <= 2).',
          3: 'Since we need some time to watch an actual movie and only after that we can promote/downgrade a connection, we will limit the number of consecutive API request with less than 30 minutes between each other.'
        }
      }
      res.status(status).json(dbResult)
    }
  })
})

app.post('/api/post/title/year', (req, res) => {
  logger.info('Request body: ' + JSON.stringify(req.body))

  database.postPromotionByTitle(neoSession, req, api, function (dbResult, status) {
    logger.info(JSON.stringify(dbResult))
    if (status === 200) {
      dbResult = api.toRelationship(dbResult)
    } else if (status == 400) {
      dbResult = {
        errorCode: 400,
        description: "Rules listed under key 'rules' are not considered in your request. Check your request!",
        rules: {
          1: "Plots shouldn't be too different from each other (checked with word embedding method and cosine similarity function)",
          2: 'Genres are connected to each other. Using these connections genres should be connected through at most 1 node (distance(node1, node2) <= 2).',
          3: 'Since we need some time to watch an actual movie and only after that we can promote/downgrade a connection, we will limit the number of consecutive API request with less than 30 minutes between each other.'
        }
      }
    }
    res.status(status).json(dbResult)
  })
})

const server = app.listen(port, ip)
console.log('Server running on http://%s:%s', ip, port)

var exportObj = {
  app: app,
  server: server,
  database: {
    driver: neoDriver,
    session: neoSession
  }
}

module.exports = exportObj
