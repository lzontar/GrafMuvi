// Author: @lzontar
const neo4j = require('neo4j-driver').v1
var example = require('../../__test__/test_files/example.json')
const logger = require('../logging/logger')
const omdb = new (require('omdbapi'))('99d69c21');


exports.connectDB = function (uri) {
  const driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', 'TEST-Movie'))
  return driver
}

exports.matchMovieRecommendationsById = function (session, id, callback) {
  params = { imdbId: id };
  const cypher = 'MATCH path = (x:Movie {imdbId: {imdbId}})-[:SIMILAR*]->(y:Movie) WHERE size(nodes(path)) = size(apoc.coll.toSet(nodes(path))) UNWIND relationships(path) AS  similar RETURN {path: path, length: length(path), sum_promotions: sum(similar.promotions)} as n ORDER BY n.length, n.sum_promotions'
  session.run(cypher, params)
  .then(result => {

      // Log response
       logger.info(JSON.stringify(result.records));
      callback(result.records, 200);
  })
  .catch(e => {
      // Output the error
      logger.error(e);
      callback({error: e}, 404);
  })
}

exports.matchMovieRecommendationsByTitle = function (session, title, released, callback) {
  params = { title: title, released: released };

  const cypher = 'MATCH path = (x:Movie {title: released: toInt({released})})-[:SIMILAR*]->(y:Movie) WHERE size(nodes(path)) = size(apoc.coll.toSet(nodes(path))) UNWIND relationships(path) AS  similar RETURN {path: path, length: length(path), sum_promotions: sum(similar.promotions)} as n ORDER BY n.length, n.sum_promotions'
  session.run(cypher, params)
  .then(result => {

      // Log response
      logger.info(JSON.stringify(result.records));
      callback(result.records, 200);
  })
  .catch(e => {
      // Output the error
      logger.error(e);
      callback({error: e}, 404);
  })
}


exports.postPromotionById = function (session, request, callback) {
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
       released1: parseInt(resId1.released.split(" ")[2]),
       released2: parseInt(resId2.released.split(" ")[2])
     }
       const cypher = 'MERGE (m1:Movie {imdbId: {id1}})<-[s:SIMILAR]-(m2:Movie{imdbId:{id2}}) ON CREATE SET s.promotions = {downgrade}, m1.imdbId = {id1}, m2.imdbId = {id2}, m1.released = {released1}, m2.released = {released2}, m1.title = {title1}, m2.title = {title2} ON MATCH SET s.promotions = s.promotions + {downgrade} MERGE (x:Movie {imdbId: {id1}})-[r:SIMILAR]->(y:Movie{imdbId:{id2}}) ON CREATE SET r.promotions = {downgrade} ON MATCH SET r.promotions = r.promotions + {downgrade} RETURN m1, m2, s, x, y, r'
       session.run(cypher, params)
       .then(result => {

           // Log response
           logger.info(JSON.stringify(result.records));
           callback(result.records, 200);
       })
       .catch(e => {
           // Output the error
           logger.error(e);
           callback({error: e}, 404);
       })
   }).catch(e => {
       // Output the error
       logger.error(e);
       callback({error: e}, 404);
   });
 }).catch(e => {
     // Output the error
     logger.error(e);
     callback({error: e}, 404);
 });
}

exports.postPromotionByTitle = function (session, request, callback) {
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
        released2:request.body.released2
      }
       const cypher = 'MERGE (m1:Movie {imdbId: {id1}})<-[s:SIMILAR]-(m2:Movie{imdbId:{id2}}) ON CREATE SET s.promotions = {downgrade}, m1.imdbId = {id1}, m2.imdbId = {id2}, m1.released = {released1}, m2.released = {released2}, m1.title = {title1}, m2.title = {title2} ON MATCH SET s.promotions = s.promotions + {downgrade} MERGE (x:Movie {imdbId: {id1}})-[r:SIMILAR]->(y:Movie{imdbId:{id2}}) ON CREATE SET r.promotions = {downgrade} ON MATCH SET r.promotions = r.promotions + {downgrade} RETURN m1, m2, s, x, y, r'
        session.run(cypher, params)
        .then(result => {

            // Log response
            logger.info(JSON.stringify(result.records));
            callback(result.records, 200);
        })
        .catch(e => {
            // Output the error
            logger.error(e);
            callback({error: e}, 404);
        })
    }).catch(e => {
        // Output the error
        logger.error(e);
        callback({error: e}, 404);
    });
  }).catch(e => {
      // Output the error
      logger.error(e);
      callback({error: e}, 404);
  });
}
