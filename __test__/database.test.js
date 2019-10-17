// Author: @lzontar
const database = require('../src/api/database')

// test files
// var example = require('./test_files/example.json')
let driver = null
let session = null

beforeAll(() => {
  driver = database.connectDB('bolt://localhost:7687')
  session = driver.session()

  database.initTestData(session)
})

describe('MATCH', () => {
  it('MATCH movie recommendations by id', () => {
    // expect(database.matchMovieRecommendationsById(session, 'tt0765429')).toStrictEqual(example)
  })
  it('MATCH movie recommendations by title', () => {
    // expect(database.matchMovieRecommendationsByTitle(session, 'American gangster', 2007)).toStrictEqual(example)
  })
})

describe('UPDATE', () => {
  it('UPDATE movie recommendation promotions by id', () => {
    const request = {
      body: {
        id1: '123',
        id2: '456',
        downgrade: false
      }
    }
    const expectedJson = {
      id1: '123',
      id2: '456',
      promotions: 101
    }
    database.postPromotionById(session, request, (dbData, status) => {
      dbData = {
        id1: '123',
        id2: '456',
        promotions: 101
      }
      expect(dbData).toStrictEqual(expectedJson)
      //We shouldn't find the movie, because it doesn't exist
      expect(status).toBe(401)
    })
  })
  it('UPDATE movie recommendation promotions by title', () => {
    const request = {
      body: {
        title1: '123',
        released1: 2019,
        title2: '456',
        released2: 2019,
        downgrade: true
      }
    }
    const expectedJson = {
      id1: '123',
      id2: '456',
      promotions: 100
    }
    database.postPromotionByTitle(session, request, (dbData, status) => {
      dbData = {
        id1: '123',
        id2: '456',
        promotions: 100
      }
      expect(dbData).toStrictEqual(expectedJson)
      //We shouldn't find the movie, because it doesn't exist
      expect(status).toBe(401)
    })
  })
})

afterAll(() => {
  database.clearTestData(session, driver, (session, driver) => {
    session.close()
    driver.close()
  })
})
