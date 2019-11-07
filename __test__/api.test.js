// Author: @lzontar
const GrafMuvi = require('../src/api')
const examplePromotions = require('./test_files/examplePromotions')
const exampleRecommendationList = require('./test_files/exampleRecommendationList')

// -------------------------------------UNIT TESTS -------------------------------------//
describe('Relationship promotion/downgrade', () => {
  const api = new GrafMuvi()
  test('Returns json, that conatains updated relationship, from data returned from database', () => {
    const sortedJson = {
      id1: 'tt0120338',
      id2: 'tt0332280',
      promotions: 2
    }
    expect(api.toRelationship(examplePromotions)).toStrictEqual(sortedJson)
  })
})
describe('Movie recommendation list', () => {
  const api = new GrafMuvi()
  test('Returns json, that contains a movie recommenadtion list, from data returned from database', () => {
    const recommendationList = {
      1: 'test2',
      2: 'test3',
      3: 'test4'
    }
    expect(api.toMovieRecommendationList(exampleRecommendationList)).toStrictEqual(recommendationList)
  })
})

describe('Movie recommendation list', () => {
  const api = new GrafMuvi()
  test('Returns json, that contains a movie recommenadtion list, from data returned from database', () => {
    const plot = 'The true story of Whitey Bulger, the brother of a state senator and the most infamous violent criminal in the history of South Boston, who became an FBI informant to take down a Mafia family invading his turf.'
  })
})
