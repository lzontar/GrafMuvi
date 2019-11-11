// Author: @lzontar

import request from 'supertest'
const app = require('../src/api/server').app
const server = require('../src/api/server').server
const database = require('../src/api/database')
const neo4jConnection = require('../src/api/server').database

beforeAll(() => {
  jest.setTimeout(10000)

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
  it('Irreasonable promotion of horror movie(It) and animation family movie(Cars)', (done) => {
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
      .post('/api/title')
      .send({
      	title1: "It",
      	released1: 2017,
      	title2: "Cars",
      	released2: 2006,
      	downgrade: false
      })
      .expect(400, expectedJson)
      .end(() => {
        done()
      })
  })
})

describe('Post Endpoints - Check IP', () => {
  it('Post 21 times -> fails last time', (done) => {
    for(let i = 0; i < 20; i++) {
      request(app)
        .post('/api/id')
        .send({
          imdbId1: '123',
          imdbId2: '456',
          downgrade: false
        }).end(() => {
          done()
        })
    }
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
      .post('/api/id')
      .send({
        imdbId1: '123',
        imdbId2: '456',
        downgrade: false
      })
      .expect(400, expectedJson)
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
