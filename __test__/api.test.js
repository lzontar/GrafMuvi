// Author: @lzontar

import request from 'supertest'
const app = require('../src/api/server')

describe('Get Endpoints', () => {
  it('Get request movie recommendation by id', () => {
    request(app)
      .get('/api/id/tt0765429')
      .expect(200, {
        1: 'Godfather',
        2: 'Training day',
        3: 'Black mass'
      })
  })
  it('Get request movie recommendation by title', () => {
    request(app)
      .get('/api/title/American%20Gangster/2007')
      .expect(200, {
        1: 'Godfather',
        2: 'Training day',
        3: 'Black mass'
      })
  })
})

describe('Post Endpoints', () => {
  it('Post request movie recommendation promotion by id', () => {
    request(app)
      .post('/api/id')
      .send({
        imdbId1: 'tt0765429',
        imdbId2: 'tt0353496',
        downgrade: false
      })
      .expect(200, {
        id1: 'tt0765429',
        id2: 'tt0353496',
        promotions: 101
      })
  })
  it('Post request movie recommendation promotion by title', () => {
    request(app)
      .post('/api/title')
      .send({
        title1: 'American gangster',
        released1: 2007,
        title2: 'Godfather',
        released2: 1991,
        downgrade: true
      })
      .expect(200, {
        id1: 'tt0765429',
        id2: 'tt0353496',
        promotions: 99
      })
  })
})
