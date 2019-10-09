import { Node } from '../src/structure/node'

// Author: @lzontar

// test files

// ------------------------------------- UNIT TESTS -------------------------------------//
test('The service should be able to call new() on Node', () => {
  const node = new Node()
  // Ensure constructor created the object:
  expect(node).toBeTruthy()
})
test('The service should be able to connect 2 nodes using class Edge', () => {
  const node1 = new Node('tt0353496', 'Godfather', 1991)
  const node2 = new Node('tt1355683', 'Black mass', 2015)

  node1.connect(node2, 100)
  expect(node1.edges.length).toBe(1)
  expect(node1.edges[0].promotions).toBe(100)
})
