// Author: @lzontar
const graph = require('../src/structure/graph')
const examplePromotions = require('./test_files/examplePromotions')
const exampleRecommendationList = require('./test_files/exampleRecommendationList')

// -------------------------------------UNIT TESTS -------------------------------------//
describe('Relationship promotion/downgrade', () => {
  test('Returns json, that conatains updated relationship, from data returned from database', () => {
    const sortedJson = {
      id1: 'tt0120338',
      id2: 'tt0332280',
      promotions: 2
    }
    expect(graph.toRelationship(examplePromotions)).toStrictEqual(sortedJson)
  })
})
describe('Movie recommendation list', () => {
  test('Returns json, that contains a movie recommenadtion list, from data returned from database', () => {
    const recommendationList = {
      1: 'test2',
      2: 'test3',
      3: 'test4'
    }
    expect(graph.toMovieRecommendationList(exampleRecommendationList)).toStrictEqual(recommendationList)
  })
})
