// Author: @lzontar
const Graph = require('../src/structure/graph')
const testGraph = new Graph()

// -------------------------------------UNIT TESTS -------------------------------------//
describe('Test of adding connection to graph', () => {
  test('Add node1 with connections to node2 and node3', () => {
    testGraph.addConnections("node1", ["node2", "node3"])
    expect(testGraph.dict["node1"]).toStrictEqual(["node2", "node3"])
  })
})

describe('Test comparing genres', () => {
  testGraph.addConnections("node1", ["node2"])
  testGraph.addConnections("node3", ["node2"])
  testGraph.addConnections("node4", ["node1"])
  testGraph.addConnections("node5", [])

  test('Extended genres', () => {
    expect(testGraph.compareGenres(["node1"],["node3"])).toBe(true)
  })
  test('Direct genres', () => {
    expect(testGraph.compareGenres(["node4"],["node1"])).toBe(true)
  })
  test('No similarity', () => {
    expect(testGraph.compareGenres(["node1"],["node5"])).toBe(false)
  })
})
