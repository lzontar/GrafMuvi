// Author: @lzontar
const GrafMuvi = require('../src/api')
const examplePromotions = require('./test_files/examplePromotions')
const exampleRecommendationList = require('./test_files/exampleRecommendationList')

const api = new GrafMuvi()

// -------------------------------------UNIT TESTS -------------------------------------//
describe('Relationship promotion/downgrade', () => {
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
  test('Returns json, that contains a movie recommenadtion list, from data returned from database', () => {
    const recommendationList = {
      1: 'test2',
      2: 'test3',
      3: 'test4'
    }
    expect(api.toMovieRecommendationList(exampleRecommendationList)).toStrictEqual(recommendationList)
  })
})

describe('Remove stopwords from plot', () => {
  test('Returns array of words from plot that are not stopwords', () => {
    const plot = 'The true story of Whitey Bulger, the brother of a state senator and the most infamous violent criminal in the history of South Boston, who became an FBI informant to take down a Mafia family invading his turf.'
    const expectedResult= ["true","story","Whitey","Bulger","brother","state","senator","infamous","violent","criminal","history","South","Boston","became","FBI","informant","take","Mafia","family","invading","turf"]
    expect(api.removeStopWordsAndPunctuations(plot)).toStrictEqual(expectedResult)
  })
})

describe('Plot comparison using word embedding and cosine similarity function', () => {
  test('Checks if plots from The godfather and Black mass are similar -> returns true', () => {
    //The godfather
    const plot1 = "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."
    //Black mass
    const plot2 = "The true story of Whitey Bulger, the brother of a state senator and the most infamous violent criminal in the history of South Boston, who became an FBI informant to take down a Mafia family invading his turf."

    expect(api.arePlotsSimilar(plot1,plot2)).toBe(true)
  })
  test('Checks if plots from Black mass and The notebook are similar -> returns false', () => {
    //The notebook
    const plot1 = "A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences."
    //Black mass
    const plot2 = "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."

    expect(api.arePlotsSimilar(plot1,plot2)).toBe(false)
  })
})

describe('Check cosine vector similarity function', () => {
  test('Cosine vector similarity function of perpendicular vectors', () => {
    let vector1 = []
    let vector2 = []
    for(let i = 0; i < 300; i++) {
      vector1.push(1)
      vector2.push((-1)**i)
    }
    expect(api.cosineVectorSimilarity(vector1, vector2, 1, 1)).toStrictEqual(0)
  })
  test('Cosine vector similarity function of parallel vectors', () => {
    let vector1 = []
    let vector2 = []
    for(let i = 0; i < 300; i++) {
      vector1.push(1)
      vector2.push(-1)
    }
    expect(Math.abs(api.cosineVectorSimilarity(vector1, vector2, 1, 1))).toBeGreaterThan(1-1e-4)
  })
})

describe('Check genre comparison', () => {
  test('Check genre comparison between Romantic and Action movies -> return true', () => {
    const json1 = {
      1: 'Action'
    }
    const json2 = {
      1: 'Romance'
    }
    expect(api.areGenresSimilar(json1, json2)).toBe(true)
  })
  test('Check genre comparison between Horror and Documentary movies -> return false', () => {
    const json1 = {
      1: 'Documentary'
    }
    const json2 = {
      1: 'Horror'
    }
    expect(api.areGenresSimilar(json1, json2)).toBe(false)
  })
  test('Check same genres -> return true', () => {
    const json1 = {
      1: 'Documentary'
    }
    const json2 = {
      1: 'Documentary'
    }
    expect(api.areGenresSimilar(json1, json2)).toBe(true)
  })
})
