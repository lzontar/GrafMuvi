// Author: @lzontar
require('dotenv').config()

const neo4j = require('neo4j-driver').v1
const logger = require('../logging/logger')
const omdb = new (require('omdbapi'))(process.env.OMDB_KEY)

exports.connectDB = function () {
  const graphenedbURL = process.env.GRAPHENEDB_URL
  const graphenedbUser = process.env.GRAPHENEDB_USER
  const graphenedbPass = process.env.GRAPHENEDB_PASSWD

  const driver = neo4j.driver(graphenedbURL, neo4j.auth.basic(graphenedbUser, graphenedbPass))
  return driver
}

exports.matchMovieRecommendationsById = function (session, id, api, callback) {
  const params = { imdbId: id }
  const cypher = 'MATCH path = (x:Movie {imdbId: {imdbId}})-[:SIMILAR*]->(y:Movie) WHERE size(nodes(path)) = size(apoc.coll.toSet(nodes(path))) UNWIND relationships(path) AS  similar RETURN {path: path, length: length(path), sum_promotions: sum(similar.promotions)} as n ORDER BY n.length, n.sum_promotions DESC'
  session.run(cypher, params)
    .then(result => {
      // Log response
      logger.info(JSON.stringify(result.records))
      callback(result.records, 200)
    })
    .catch(e => {
      // Output the error
      logger.error(e)
      const error = { error: 'error.not_found' }
      callback(error, 404)
    })
}

exports.matchMovieRecommendationsByTitle = function (session, title, released, api, callback) {
  const params = { title: title, released: released }

  const cypher = 'MATCH path = (x:Movie {title: {title}, released: toInt({released})})-[:SIMILAR*]->(y:Movie) WHERE size(nodes(path)) = size(apoc.coll.toSet(nodes(path))) UNWIND relationships(path) AS  similar RETURN {path: path, length: length(path), sum_promotions: sum(similar.promotions)} as n ORDER BY n.length, n.sum_promotions DESC'
  session.run(cypher, params)
    .then(result => {
      // Log response

      logger.info(JSON.stringify(result.records))
      callback(result.records, 200)
    })
    .catch(e => {
      // Output the error
      logger.error(e)
      const error = { error: 'error.not_found', source: 'Neo4j database' }
      callback(error, 404)
    })
}

exports.postPromotionById = function (session, request, api, callback) {
  omdb.get({
    id: request.body.id1
  }).then(resId1 => {
    omdb.get({
      id: request.body.id2
    }).then(resId2 => {
      const params = {
        id1: request.body.id1,
        id2: request.body.id2,
        downgrade: request.body.downgrade !== undefined && request.body.downgrade ? -1 : 1,
        title1: resId1.title,
        title2: resId2.title,
        released1: parseInt(resId1.released.split(' ')[2]),
        released2: parseInt(resId2.released.split(' ')[2])
      }
      const plotsAreSimilar = api.arePlotsSimilar(resId1.plot, resId2.plot)

      //Check if user can promote/downgrade this promotion (is it reasonable, are genres similar, are there too many requests from this IP)
      if(((plotsAreSimilar || (!plotsAreSimilar && request.body.downgrade)) && api.areGenresSimilar(resId1.genre, resId2.genre)) && api.checkIP(request.connection.remoteAddress)) {
        const cypher = 'MERGE (m1:Movie {imdbId: {id1}}) ON CREATE SET m1.imdbId = {id1}, m1.released = {released1}, m1.title = {title1} MERGE (m2:Movie{imdbId:{id2}}) ON CREATE SET m2.imdbId = {id2}, m2.released = {released2}, m2.title = {title2} MERGE (m1)<-[s:SIMILAR]-(m2) ON CREATE SET s.promotions = {downgrade} ON MATCH SET s.promotions = s.promotions + {downgrade} MERGE (m1)-[r:SIMILAR]->(m2) ON CREATE SET r.promotions = {downgrade} ON MATCH SET r.promotions = r.promotions + {downgrade} RETURN m1, m2, s'
        session.run(cypher, params)
          .then(result => {
            // Log response
            logger.info(JSON.stringify(result.records))
            callback(result.records, 200)
          })
          .catch(e => {
            // Output the error
            logger.error(e)
            const error = { error: 'error.not_found', source: 'Neo4j database' }
            callback(error, 404)
          })
      } else {
        const error = { error: 'error.bad_request', source: 'GrafMuviAPI' }
        callback(error, 400)
      }
    }).catch(e => {
      // Output the error
      logger.error(e)
      const error = { error: 'error.not_found', source: 'OmdbAPI' }
      callback(error, 404)
    })
  }).catch(e => {
    // Output the error
    logger.error(e)
    const error = { error: 'error.not_found', source: 'OmdbAPI' }
    callback(error, 404)
  })
}

exports.postPromotionByTitle = function (session, request, api, callback) {
  omdb.get({
    title: request.body.title1,
    year: request.body.released1
  }).then(resId1 => {
    omdb.get({
      title: request.body.title2,
      year: request.body.released2
    }).then(resId2 => {
      const params = {
        id1: resId1.imdbid,
        id2: resId2.imdbid,
        downgrade: request.body.downgrade !== undefined && request.body.downgrade ? -1 : 1,
        title1: request.body.title1,
        title2: request.body.title2,
        released1: request.body.released1,
        released2: request.body.released2
      }
      logger.info('Request call IP: ' + request.connection.remoteAddress)

      const plotsAreSimilar = api.arePlotsSimilar(resId1.plot, resId2.plot)
      //Check if user can promote/downgrade this promotion (is it reasonable, are genres similar, are there too many requests from this IP)
      if(((plotsAreSimilar || (!plotsAreSimilar && request.body.downgrade)) && api.areGenresSimilar(resId1.genre, resId2.genre)) && api.checkIP(request.connection.remoteAddress)) {
       const cypher = 'MERGE (m1:Movie {imdbId: {id1}}) ON CREATE SET m1.imdbId = {id1}, m1.released = {released1}, m1.title = {title1} MERGE (m2:Movie{imdbId:{id2}}) ON CREATE SET m2.imdbId = {id2}, m2.released = {released2}, m2.title = {title2} MERGE (m1)<-[s:SIMILAR]-(m2) ON CREATE SET s.promotions = {downgrade} ON MATCH SET s.promotions = s.promotions + {downgrade} MERGE (m1)-[r:SIMILAR]->(m2) ON CREATE SET r.promotions = {downgrade} ON MATCH SET r.promotions = r.promotions + {downgrade} RETURN m1, m2, s'
        session.run(cypher, params)
          .then(result => {
            // Log response
            logger.info(JSON.stringify(result.records))
            callback(result.records, 200)
          })
          .catch(e => {
            // Output the error
            logger.error(e)
            const error = { error: 'error.not_found', source: 'Neo4j database' }
            callback(error, 404)
          })
      } else {
        const error = { error: 'error.bad_request', source: 'GrafMuviAPI' }
        callback(error, 400)
      }
    }).catch(e => {
      // Output the error
      logger.error(e)
      const error = { error: 'error.not_found', source: 'OmdbAPI' }
      callback(error, 404)
    })
  }).catch(e => {
    // Output the error
    logger.error(e)
    const error = { error: 'error.not_found', source: 'OmdbAPI' }
    callback(error, 404)
  })
}
