import { Edge } from './edge'

// Author: @lzontar

export class Node {
  constructor (imdbId, title, released) {
    this.imdbId = imdbId
    this.title = title
    this.released = released
    this.edges = []
  }

  connect (node, promotions) {
    const edge = new Edge(this, node, promotions)
    this.edges.push(edge)
    return edge
  }
}
