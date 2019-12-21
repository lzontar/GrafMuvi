// Author: @lzontar

import request from 'supertest'
const app = require('../server').app
const server = require('../server').server
const port = require('../server').port
const ip = require('../server').ip

const GrafMuvi = require('../src/api.js')
const api = new GrafMuvi()

const database = require('../src/api/database')
const neo4jConnection = require('../server').database


const logger = require('../src/logging/logger')

beforeAll(() => {
  jest.setTimeout(15000)

  initTestData(neo4jConnection.session)
})

beforeEach(() => {
  api.resetIPJson()
})

describe('/ and /status endpoints', () => {
  it('Get / endpoint', (done) => {
    request(app)
      .get('/')
      .expect(200, {
        status: 'OK',
        ejemplo: {
          ruta: 'https://grafmuvi.herokuapp.com/api/title/The godfather/1972',
          valor: "{JSON: { 1: 'American gangster', 2: 'Black mass', 3: 'Training day' }}"
        }
      }, done)
  })
  it('Get /status endpoint', (done) => {
    request(app)
      .get('/status')
      .expect(200, {
        status: 'OK',
        ejemplo: {
          ruta: 'https://grafmuvi.herokuapp.com/api/title/The godfather/1972',
          valor: "{JSON: { 1: 'American gangster', 2: 'Black mass', 3: 'Training day' }}"
        }
      }, done)
  })
})
describe('Get Endpoints', () => {
  it('Get request movie recommendation by id', (done) => {
    request(app)
      .get('/api/id/123')
      .expect(200, {
        1: 'test2',
        2: 'test3',
        3: 'test4'
      }, done)
  })
  it('Get request movie recommendation by title', (done) => {
    request(app)
      .get('/api/title/test1/2019')
      .expect(200, {
        1: 'test2',
        2: 'test3',
        3: 'test4'
      }, done)
  })
})

describe('Post Endpoints', () => {

  it('Post request movie recommendation promotion by id', (done) => {
    request(app)
      .post('/api/post/id')
      .send({
        id1: 'tt0068646',
        id2: 'tt1355683',
        downgrade: false
      })
      .expect(200, {
        id1: 'tt0068646',
        id2: 'tt1355683',
        promotions: 101
      }, done)
  })
  it('Post request movie recommendation promotion by title', (done) => {
    request(app)
      .post('/api/post/title/year')
      .send({
        title1: 'The godfather',
        year1: 1972,
        title2: 'Black mass',
        year2: 2015,
        downgrade: true
      })
      .expect(200, {
        id1: 'tt0068646',
        id2: 'tt1355683',
        promotions: 100
      }, done)
  })
  it('Irreasonable promotion of horror movie(It) and animation family movie(Cars) by title', (done) => {
    const expectedJson = {
      errorCode: 400,
      description: "Rules listed under key 'rules' are not considered in your request. Check your request!",
      rules: {
        1:"Plots shouldn't be too different from each other (checked with word embedding method and cosine similarity function)",
        2:"Genres are connected to each other. Using these connections genres should be connected through at most 1 node (distance(node1, node2) <= 2).",
        3:"Since we need some time to watch an actual movie and only after that we can promote/downgrade a connection, we will limit the number of consecutive API request with less than 30 minutes between each other."
      }
    }
    request(app)
      .post('/api/post/title/year')
      .send({
      	title1: 'It',
      	released1: 2017,
      	title2: 'Cars',
      	released2: 2006,
      	downgrade: false
      })
      .expect(400, expectedJson, done)
  })
  it('Irreasonable promotion of horror movie(It) and animation family movie(Cars) by ID', (done) => {
    const expectedJson = {
      errorCode: 400,
      description: "Rules listed under key 'rules' are not considered in your request. Check your request!",
      rules: {
        1:"Plots shouldn't be too different from each other (checked with word embedding method and cosine similarity function)",
        2:"Genres are connected to each other. Using these connections genres should be connected through at most 1 node (distance(node1, node2) <= 2).",
        3:"Since we need some time to watch an actual movie and only after that we can promote/downgrade a connection, we will limit the number of consecutive API request with less than 30 minutes between each other."
      }
    }
    request(app)
      .post('/api/post/id')
      .send({
      	id1: 'tt1396484',
      	id2: 'tt0317219',
      	downgrade: false
      })
      .expect(400, expectedJson, done)
  })
})

afterAll(() => {
  clearTestData(neo4jConnection.session, neo4jConnection.driver, function (driver, session) {
    driver.close()
    session.close()
  })
  server.close()
  api.resetIPJson()
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
