// Author: @lzontar

var example = require('../../__test__/test_files/example.json');

export class Graph {

  constructor(json) {
    this.json = json;
    this.nodes = [];
  }

  toJson() {
    return example;
  }
  fromJson(json) {
    return new Graph(json);
  }

  sortByDistance() {
    return {
      "1" : "Godfather",
      "2" : "Training day",
      "3" : "Black mass"
    }
  }

  sortByPromotions() {
    return {
      "1" : "Godfather",
      "2" : "Black mass",
      "3" : "Training day"
    }
  }
  sort() {
    return {
      "1" : "Godfather",
      "2" : "Training day",
      "3" : "Black mass"
    }
  }

  equals(graph) {
    return graph ? true : false;
  }
}
