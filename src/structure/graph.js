class Graph {
  constructor () {
    this.dict = []
  }

  addConnections (key, array) {
    this.dict[key] = array
  }

  compareGenres (genres1, genres2) {
    genres1 = new Set(genres1)
    genres2 = new Set(genres2)

    const extendedGenres1 = new Set()
    const extendedGenres2 = new Set()

    // direct comparison
    genres1.forEach((x) => {
      genres2.forEach((y) => {
        if (x.equals(y)) {
          return true
        } else {
          // build extended set
          this.dict[x].forEach(item => extendedGenres1.add(item))
          this.dict[y].forEach(item => extendedGenres2.add(item))
          extendedGenres1.add(x)
          extendedGenres2.add(y)
        }
      })
    })

    // Extended genres
    extendedGenres1.forEach((x) => {
      extendedGenres2.forEach((y) => {
        if (x.equals(y)) {
          return true
        }
      })
    })
    return false
  }
}

module.exports = Graph
