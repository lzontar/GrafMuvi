// Author: @lzontar

// test files
var example = require('./test_files/example.json')

const database = require('../src/api/database')

describe('MATCH', () => {
  it('MATCH movie recommendations by id', () => {
    const driver = database.connectDB('bolt://localhost:7687')
    const session = driver.session()
    expect(database.matchMovieRecommendationsById(session, 'tt0765429')).toStrictEqual(example)
    session.close()
    driver.close()
  })
  it('MATCH movie recommendations by title', () => {
    const driver = database.connectDB('bolt://localhost:7687')
    const session = driver.session()
    expect(database.matchMovieRecommendationsByTitle(session, 'American gangster', 2007)).toStrictEqual(example)
    session.close()
    driver.close()
  })
})

describe('UPDATE', () => {
  it('UPDATE movie recommendation promotions by id', () => {
    const driver = database.connectDB('bolt://localhost:7687')
    const session = driver.session()
    const expectedJson = {
      id1: 'tt0765429',
      id2: 'tt0353496',
      promotions: 101
    }
    expect(database.postPromotionById(session, 'tt0765429', 'tt0353496', false)).toStrictEqual(expectedJson)
    session.close()
    driver.close()
  })
  it('UPDATE movie recommendation promotions by title', () => {
    const driver = database.connectDB('bolt://localhost:7687')
    const session = driver.session()
    const expectedJson = {
      id1: 'tt0765429',
      id2: 'tt0353496',
      promotions: 99
    }
    expect(database.postPromotionByTitle(session, 'American gangster', 2007, 'Godfather', 1991, true)).toStrictEqual(expectedJson)
    session.close()
    driver.close()
  })
})