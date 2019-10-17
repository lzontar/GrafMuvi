// Author: @lzontar

import request from 'supertest'
const app = require('../src/api/server').app
const server = require('../src/api/server').server
const database = require('../src/api/database')
const neo4jConnection = require('../src/api/server').database

beforeAll(() => {
  database.initTestData(neo4jConnection.session)
})

describe('Get Endpoints', () => {
  it('Get request movie recommendation by id', (done) => {
    request(app)
      .get('/api/id/123')
      .expect(200, {
        1: 'test2',
        2: 'test3',
        3: 'test4'
      })
      .end(() => {
        done()
      })
  })
  it('Get request movie recommendation by title', (done) => {
    request(app)
      .get('/api/title/test1/2019')
      .expect(200, {
        1: 'test2',
        2: 'test3',
        3: 'test4'
      })
      .end(() => {
        done()
      })
  })
})

describe('Post Endpoints', () => {
  it('Post request movie recommendation promotion by id', (done) => {
    request(app)
      .post('/api/id')
      .send({
        imdbId1: '123',
        imdbId2: '456',
        downgrade: false
      })
      .expect(200, {
        id1: '123',
        id2: '456',
        promotions: 101
      })
      .end(() => {
        done()
      })
  })
  it('Post request movie recommendation promotion by title', (done) => {
    request(app)
      .post('/api/title')
      .send({
        title1: 'test1',
        released1: 2019,
        title2: 'test2',
        released2: 2019,
        downgrade: true
      })
      .expect(200, {
        id1: '123',
        id2: '456',
        promotions: 99
      })
      .end(() => {
        done()
      })
  })
})

afterAll(() => {
  database.clearTestData(neo4jConnection.session, neo4jConnection.driver, function (driver, session) {
    driver.close()
    session.close()
  })
  server.close()
})
