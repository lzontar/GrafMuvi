// Author: @lzontar
const neo4j = require('neo4j-driver').v1
var example = require('../../__test__/test_files/example.json')

exports.connectDB = function (uri) {
  const driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', 'TEST-Movie'))
  return driver
}

exports.matchMovieRecommendationsById = function (session, id) {
  return session && id ? example : undefined
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
