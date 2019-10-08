// Author: @lzontar
const neo4j = require('neo4j-driver').v1;
var example = require('../../__test__/test_files/example.json');

exports.connectDB = function(uri) {
  const driver = neo4j.driver(uri, neo4j.auth.basic("neo4j", "neo4j"));
  return driver.session();
}

exports.matchMovieRecommendationsById = function(session, id) {
  if(session && id) {

  }
  return example;
}

exports.matchMovieRecommendationsByTitle = function(session, title, year) {
  if(session && title && year) {

  }
  return example;
}

exports.postPromotionById = function(session, id1,id2, downgrade) {
  if(session && id1 && id2) {

  }
  return {
    "id1" : "tt0765429",
    "id2" : "tt0353496",
    "promotions": 101,
  };
}
exports.postPromotionByTitle = function(session, title1, released1, title2, released2, downgrade) {
  if(session && title1 && released1 && title2 && released2) {

  }
  return {
    "id1" : "tt0765429",
    "id2" : "tt0353496",
    "promotions": 99,
  };
}
