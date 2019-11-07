// Author: @lzontar
const database = require('../src/api/database')
const logger = require('../src/logging/logger')

let driver = null
let session = null

const GrafMuvi = require('../src/api.js')
const api = new GrafMuvi()

beforeAll(() => {
  jest.setTimeout(10000)

  driver = database.connectDB()
  session = driver.session()

  database.initTestData(session)
})

describe('MATCH', () => {
  it('MATCH movie recommendations by id - lengths', () => {

    database.matchMovieRecommendationsById(session, '123', api, (dbData, status) => {
      const len1 = dbData[0].get('n').length.toNumber()
      const len2 = dbData[0].get('n').length.toNumber()
      const len3 = dbData[0].get('n').length.toNumber()

      expect(len1).toStrictEqual(1)
      expect(len2).toStrictEqual(1)
      expect(len3).toStrictEqual(1)

      expect(status).toBe(200)
    })
  })
  it('MATCH movie recommendations by id - promotions', () => {
    database.matchMovieRecommendationsById(session, '123', api, (dbData, status) => {
      const promotions1 = dbData[0].get('n').sum_promotions.toNumber()
      const promotions2 = dbData[1].get('n').sum_promotions.toNumber()
      const promotions3 = dbData[2].get('n').sum_promotions.toNumber()

      expect(promotions1).toStrictEqual(100)
      expect(promotions2).toStrictEqual(50)
      expect(promotions3).toStrictEqual(25)

      expect(status).toBe(200)
    })
  })
  it('MATCH movie recommendations by id - end nodes', () => {
    database.matchMovieRecommendationsById(session, '123', api, (dbData, status) => {
      const title1 = dbData[0].get('n').path.end.properties.title
      const title2 = dbData[1].get('n').path.end.properties.title
      const title3 = dbData[2].get('n').path.end.properties.title

      expect(title1).toStrictEqual('test2')
      expect(title2).toStrictEqual('test3')
      expect(title3).toStrictEqual('test4')

      expect(status).toBe(200)
    })
  })
  it('MATCH movie recommendations by title - lengths', () => {
    database.matchMovieRecommendationsByTitle(session, 'test1', 2019, api, (dbData, status) => {
      const len1 = dbData[0].get('n').length.toNumber()
      const len2 = dbData[0].get('n').length.toNumber()
      const len3 = dbData[0].get('n').length.toNumber()

      expect(len1).toStrictEqual(1)
      expect(len2).toStrictEqual(1)
      expect(len3).toStrictEqual(1)

      expect(status).toBe(200)
    })
  })
  it('MATCH movie recommendations by title - promotions', () => {
    database.matchMovieRecommendationsByTitle(session, 'test1', 2019, api, (dbData, status) => {
      const promotions1 = dbData[0].get('n').sum_promotions.toNumber()
      const promotions2 = dbData[1].get('n').sum_promotions.toNumber()
      const promotions3 = dbData[2].get('n').sum_promotions.toNumber()

      expect(promotions1).toStrictEqual(100)
      expect(promotions2).toStrictEqual(50)
      expect(promotions3).toStrictEqual(25)
      expect(status).toBe(200)
    })
  })
  it('MATCH movie recommendations by title - end nodes', () => {
    database.matchMovieRecommendationsByTitle(session, 'test1', 2019, api, (dbData, status) => {
      const title1 = dbData[0].get('n').path.end.properties.title
      const title2 = dbData[1].get('n').path.end.properties.title
      const title3 = dbData[2].get('n').path.end.properties.title

      expect(title1).toStrictEqual('test2')
      expect(title2).toStrictEqual('test3')
      expect(title3).toStrictEqual('test4')

      expect(status).toBe(200)
    })
  })
})

describe('UPDATE', () => {
  it('UPDATE movie recommendation promotions by id - FAIL because of unexisting movie', () => {
    const request = {
      body: {
        id1: '123',
        id2: '456',
        downgrade: false
      }
    }
    const expectedJson = { error: 'error.not_found', source: 'OmdbAPI' }
    database.postPromotionById(session, request, api, (dbData, status) => {
      expect(dbData).toStrictEqual(expectedJson)
      // We shouldn't find the movie in OmdbAPI, because it doesn't exist
      expect(status).toBe(404)
    })
  })
  it('UPDATE movie recommendation promotions by id', () => {
    const request = {
      body: {
        id1: 'tt0765429',
        id2: 'tt0353496',
        downgrade: false
      }
    }
    const expected = 101
    return new Promise((resolve, reject) => {
      database.postPromotionById(session, request, api, (dbData, status) => {
        resolve(dbData, status)
      })
    }).then((data, status) => {
      expect(data[0].get('s').properties.promotions).toBe(expected)
      expect(status).toBe(200)
    }).catch((e) => {
      logger.error(e)
    })
  })
  it('UPDATE movie recommendation promotions by title', () => {
    const request = {
      body: {
        title1: 'American gangster',
        released1: 2007,
        title2: 'Godfather',
        released2: 1991,
        downgrade: true
      }
    }
    const expected = 100
    return new Promise((resolve, reject) => {
      database.postPromotionByTitle(session, request, api, (dbData, status) => {
        resolve(dbData, status)
      })
    }).then((data, status) => {
      expect(data[0].get('s').properties.promotions).toBe(expected)
      expect(status).toBe(200)
    }).catch((e) => {
      logger.error(e)
    })
  })
  it('UPDATE movie recommendation promotions by title - FAIL because of unexisting movie', () => {
    const request = {
      body: {
        title1: '123',
        released1: 2019,
        title2: '456',
        released2: 2019,
        downgrade: true
      }
    }
    const expectedJson = { error: 'error.not_found', source: 'OmdbAPI' }
    database.postPromotionByTitle(session, request, api, (dbData, status) => {
      expect(dbData).toStrictEqual(expectedJson)
      // We shouldn't find the movie in OmdbAPI, because it doesn't exist
      expect(status).toBe(404)
    })
  })
})

afterAll(async () => {
  database.clearTestData(session, driver, (session, driver) => {
    session.close()
    driver.close()
  })
})
