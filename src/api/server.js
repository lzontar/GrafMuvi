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
      path: 'https://grafmuvi.herokuapp.com/api/title/The godfather/1972',
      returnValue: { 1: 'American gangster', 2: 'Black mass', 3: 'Training day' }
    }
  })
})

app.get('/api/id/:imdbId', (req, res) => {
  logger.info('Request parameters: ' + req.params.imdbId)

  this.api.checkIP(req.connection.remoteAddress)

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
    if(status === 200) {
      dbResult = api.toRelationship(dbResult)
    } else if(status === 400) {
      dbResult = {
        errorCode: 400,
        description: "Rules listed under key 'rules' are not considered in your request. Check your request!",
        rules: {
          1:"Plots shouldn't be too different from each other (checked with word embedding method and cosine similarity function)",
          2:"Genres are connected to each other. Using these connections genres should be connected through at most 1 node (distance(node1, node2) <= 2).",
          3:"Since we need some time to watch an actual movie and only after that we can promote/downgrade a connection, we will limit the number of consecutive API request with less than 30 minutes between each other."
        }
      }
    }
    res.status(status).json(dbResult)  })
})

app.post('/api/post/title/year', (req, res) => {
  logger.info('Request body: ' + JSON.stringify(req.body))

  database.postPromotionByTitle(neoSession, req, api, function (dbResult, status) {
    logger.info(JSON.stringify(dbResult))
    if(status === 200) {
      dbResult = api.toRelationship(dbResult)
    } else if(status == 400) {
      dbResult = {
        errorCode: 400,
        description: "Rules listed under key 'rules' are not considered in your request. Check your request!",
        rules: {
          1:"Plots shouldn't be too different from each other (checked with word embedding method and cosine similarity function)",
          2:"Genres are connected to each other. Using these connections genres should be connected through at most 1 node (distance(node1, node2) <= 2).",
          3:"Since we need some time to watch an actual movie and only after that we can promote/downgrade a connection, we will limit the number of consecutive API request with less than 30 minutes between each other."
        }
      }
    }
    res.status(status).json(dbResult)
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
