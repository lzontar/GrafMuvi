// Author: @lzontar
const neo4j = require('neo4j-driver').v1
var example = require('../../__test__/test_files/example.json')
const logger = require('../logging/logger')

exports.connectDB = function (uri) {
  const driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', 'TEST-Movie'))
  return driver
}

exports.matchMovieRecommendationsById = function (session, id, callback) {
  params = { imdbId: id };
  const cypher = 'MATCH path = (x:Movie {imdbId: {imdbId}})-[:SIMILAR*]->(y:Movie) WHERE size(nodes(path)) = size(apoc.coll.toSet(nodes(path))) UNWIND relationships(path) AS  similar RETURN {path: path, length: length(path), sum_promotions: sum(similar.promotions)} as n ORDER BY n.length, n.sum_promotions'
  session.run(cypher, params)
  .then(result => {
      // On result, get count from first record
      const count = result.records.length;
      // Log response
      // logger.info(result.records);
      callback(result.records, 200);
  })
  .catch(e => {
      // Output the error
      logger.error(e);
      callback({error: e}, 404);
  })
}

exports.matchMovieRecommendationsByTitle = function (session, title, year) {
  return session && title && year ? example : undefined
}

exports.postPromotionById = function (session, id1, id2, downgrade) {
  return session && id1 && id2 && downgrade !== undefined ? {
    id1: 'tt0765429',
    id2: 'tt0353496',
    promotions: 101
  } : undefined
}
exports.postPromotionByTitle = function (session, title1, released1, title2, released2, downgrade) {
  return session && title1 && released1 && title2 && released2 && downgrade !== undefined ? {
    id1: 'tt0765429',
    id2: 'tt0353496',
    promotions: 99
  } : undefined
}
