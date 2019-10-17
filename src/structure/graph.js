// Author: @lzontar

exports.toRelationship = function (json) {
  const promotions = json[0]._fields[2].properties.promotions
  const movieId1 = json[0]._fields[0].properties.imdbId
  const movieId2 = json[0]._fields[1].properties.imdbId
  return {
    id1: movieId1,
    id2: movieId2,
    promotions: promotions
  }
}
exports.toMovieRecommendationList = function (json) {
  const recommendationList = {}
  let i = 0
  while (json[i] !== undefined) {
    recommendationList[i + 1] = json[i]._fields[0].path.end.properties.title
    i++
  }
  return recommendationList
}
