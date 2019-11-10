
class Graph {
  constructor () {
    this.dict = []
  }

  addConnections (key, array) {
    this.dict[key] = array
  }

  compareGenres (genres1, genres2) {
    let genreSet1 = new Set(genres1)
    let genreSet2 = new Set(genres2)

    let extendedGenres1 = new Set()
    let extendedGenres2 = new Set()

    let result = false;

    // direct comparison
    Array.from(genreSet1).forEach((x) => {
      Array.from(genreSet2).forEach((y) => {
        if (x == y) {
          result = true
        } else {
          // build extended set
          this.dict[x].forEach(item => extendedGenres1.add(item))
          this.dict[y].forEach(item => extendedGenres2.add(item))
          extendedGenres1.add(x)
          extendedGenres2.add(y)
        }
      })
    })

    //Extended genres
    Array.from(extendedGenres1).forEach((x) => {
      Array.from(extendedGenres2).forEach((y) => {
        if (x == y) {
          result = true
        }
      })
    })

    return result
  }
}

module.exports = Graph
