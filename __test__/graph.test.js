import { Graph } from '../src/structure/graph'

// Author: @lzontar

// test files
var example = require('./test_files/example.json')

// -------------------------------------UNIT TESTS -------------------------------------//
describe('Constructor', () => {
  test('The service should be able to call new() on Graph', () => {
    const graph = new Graph()
    // Ensure constructor created the object:
    expect(graph).toBeTruthy()
  })
})
describe('Graph comparison', () => {
  test('Test of Graph.equals() function - empty graphs', () => {
    const graph1 = new Graph()
    const graph2 = new Graph()

    expect(graph1.equals(graph2)).toBe(true)
  })

  test('Test of Graph.equals() function - non-empty graphs', () => {
    const json = example
    const graph1 = new Graph(json)
    const graph2 = new Graph(json)

    expect(graph1.equals(graph2)).toBe(true)
  })
})

describe('JSON', () => {
  test('Test of Graph.fromJson() function', () => {
    const json = example
    const graph1 = new Graph(json)
    const graph2 = new Graph()
    graph2.fromJson(json)

    expect(graph1.equals(graph2)).toBe(true)
  })

  test('Test of Graph.toJson() function', () => {
    const expectedJson = example
    const graph = new Graph(example)
    expect(graph.toJson()).toBe(expectedJson)
  })
})
// -------------------------------------INTEGRATION TESTS -------------------------------------//
describe('Sorting', () => {
  test('Test function sortByDistance(), graph sort by distance', () => {
    const unsortedJson = example
    const sortedJson = {
      1: 'Godfather',
      2: 'Training day',
      3: 'Black mass'
    }
    const graph = new Graph(unsortedJson)

    expect(graph.sortByDistance()).toStrictEqual(sortedJson)
  })

  test('Test function sortByPromotions(), graph sort by number of promotions', () => {
    const unsortedJson = example
    const sortedJson = {
      1: 'Godfather',
      2: 'Black mass',
      3: 'Training day'
    }
    const graph = new Graph(unsortedJson)

    expect(graph.sortByPromotions()).toStrictEqual(sortedJson)
  })

  test('Test function sort()', () => {
    const unsortedJson = example
    const sortedJson = {
      1: 'Godfather',
      2: 'Training day',
      3: 'Black mass'
    }
    const graph = new Graph(unsortedJson)

    expect(graph.sort()).toStrictEqual(sortedJson)
  })
})
