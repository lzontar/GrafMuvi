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

  initTestData(session)
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

describe('CYPHER error', () => {
  it('Neo4j Error', () => {
    database.runNeo4jQuery(session, 'Cypher query with wrong syntax', {}, (json, status) => {
      expect(json).toStrictEqual({ error: 'error.not_found', source: 'Neo4j database' })
      expect(status).toBe(404)
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
        id1: 'tt0068646',
        id2: 'tt1355683',
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
        title1: 'The godfather',
        year1: 1972,
        title2: 'Black mass',
        year2: 2015,
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

it('UPDATE movie recommendation promotions by title - Bad 1st movie name OMDBAPI fails', () => {
  const request = {
    body: {
      title1: 'This movie doesn\'t exist',
      released1: 2200,
      title2: 'The godfather',
      released2: 1972,
      downgrade: true
    }
  }
  return new Promise((resolve, reject) => {
    database.postPromotionByTitle(session, request, api, (dbData, status) => {
      resolve(dbData, status)
    })
  }).then((data, status) => {
    const expectedJson = { error: 'error.not_found', source: 'OmdbAPI' }
    database.postPromotionByTitle(session, request, api, (dbData, status) => {
      expect(dbData).toStrictEqual(expectedJson)
      // We shouldn't find the movie in OmdbAPI, because it doesn't exist
      expect(status).toBe(404)
    })
  }).catch((e) => {
    logger.error(e)
  })
})
it('UPDATE movie recommendation promotions by title - Bad 2nd movie name OMDBAPI fails', () => {
  const request = {
    body: {
      title1: 'The godfather',
      released1: 1972,
      title2: 'This movie doesn\'t exist',
      released2: 2200,
      downgrade: true
    }
  }
  return new Promise((resolve, reject) => {
    database.postPromotionByTitle(session, request, api, (dbData, status) => {
      resolve(dbData, status)
    })
  }).then((data, status) => {
    const expectedJson = { error: 'error.not_found', source: 'OmdbAPI' }
    database.postPromotionByTitle(session, request, api, (dbData, status) => {
      expect(dbData).toStrictEqual(expectedJson)
      // We shouldn't find the movie in OmdbAPI, because it doesn't exist
      expect(status).toBe(404)
    })
  }).catch((e) => {
    logger.error(e)
  })
})
it('Database - Irreasonable promotion of horror movie(It) and animation family movie(Cars) by Title', () => {
  const request = {
    body: {
      title1: 'It',
      released1: 2017,
      title2: 'Cars',
      released2: 2006,
      downgrade: false
    }
  }
  const expectedJson = { error: 'error.bad_request', source: 'GrafMuviAPI' }
  return new Promise((resolve, reject) => {
    database.postPromotionByTitle(session, request, api, (dbData, status) => {
      resolve(dbData, status)
    })
  }).then((data, status) => {
    expect(dbData).toStrictEqual(expectedJson)
    // We shouldn't find the movie in OmdbAPI, because it doesn't exist
    expect(status).toBe(400)
  }).catch((e) => {
    logger.error(e)
  })
})
it('Database - Irreasonable promotion of horror movie(It) and animation family movie(Cars) by ID', () => {
  const request = {
    body: {
      imdbId1: "tt1396484",
      imdbId2: "tt0317219",
      downgrade: false
    }
  }
  const expectedJson = { error: 'error.bad_request', source: 'GrafMuviAPI' }
  return new Promise((resolve, reject) => {
    database.postPromotionByTitle(session, request, api, (dbData, status) => {
      resolve(dbData, status)
    })
  }).then((data, status) => {
    expect(dbData).toStrictEqual(expectedJson)
    // We shouldn't find the movie in OmdbAPI, because it doesn't exist
    expect(status).toBe(400)
  }).catch((e) => {
    logger.error(e)
  })
})

afterAll(async () => {
  clearTestData(session, driver, (session, driver) => {
    session.close()
    driver.close()
  })
})

function initTestData(session) {
  const cypher = 'MERGE (m1:Movie{title:\'test1\', released: 2019, imdbId: \'123\'}) MERGE (m2:Movie{title:\'test2\', released: 2019, imdbId: \'456\'}) MERGE (m3:Movie{title:\'test3\', released: 2019, imdbId: \'789\'}) MERGE (m4:Movie{title:\'test4\', released: 2019, imdbId: \'101112\'}) MERGE (m1)-[s1:SIMILAR]->(m2)-[s2:SIMILAR]->(m1) MERGE (m1)-[s3:SIMILAR]->(m3)-[s4:SIMILAR]->(m1) MERGE (m1)-[s5:SIMILAR]->(m4)-[s6:SIMILAR]->(m1) SET s1.promotions = 100, s2.promotions = 100, s3.promotions = 50, s4.promotions = 50, s5.promotions = 25, s6.promotions = 25'
  session.run(cypher)
    .then(result => {
      // Log response
      // logger.info(JSON.stringify(result.records))
    })
    .catch(e => {
      // Output the error
      logger.error(e)
    })
}
function clearTestData(session, driver, callback) {
  const cypher = 'MATCH (x:Movie)-[s:SIMILAR]->(y:Movie) WHERE x.imdbId=\'123\' OR x.imdbId=\'456\' OR x.imdbId=\'789\' OR x.imdbId=\'101112\' DELETE s DELETE x'
  session.run(cypher)
    .then(result => {
      // Log response
      // logger.info(JSON.stringify(result))
      callback(session, driver)
    })
    .catch(e => {
      // Output the error
      logger.error(e)
      callback(session, driver)
    })
}
