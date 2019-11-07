var Graph = require('./structure/graph.js')

class GrafMuvi {
  constructor () {
    this.generateGenreGraph()
  }

  removeStopWordsAndPunctuations (plot) {
    const stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', '', ' ']

    // replace punctuations
    plot = plot.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ')
    var plotWords = plot.split(' ')
    var result = []
    plotWords.forEach((x) => {
      const y = x.toLowerCase()
      if (!stopwords.includes(y)) {
        result.push(x)
      }
    })

    return result.join(' ')
  }

  generateGenreGraph () {
    this.genreGraph = new Graph()
    this.genreGraph.addConnections('Action', ['Adventure', 'Biography', 'Comedy', 'Drama', 'Romance', 'Sci-Fi', 'War', 'Crime', 'Western'])
    this.genreGraph.addConnections('Adventure', ['Biography', 'Drama', 'History', 'Fantasy', 'Sci-Fi', 'Animation', 'Action', 'Family'])
    this.genreGraph.addConnections('Animation', ['Adventure', 'Family', 'Fantasy', 'Comedy'])
    this.genreGraph.addConnections('Biography', ['Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'History', 'Music', 'Romance', 'Sport', 'War', 'Western', 'Musical'])
    this.genreGraph.addConnections('Comedy', ['Action', 'Animation', 'Family', 'Fantasy', 'Romance', 'Sport'])
    this.genreGraph.addConnections('Crime', ['Action', 'Biography', 'Drama', 'Thriller', 'Mystery'])
    this.genreGraph.addConnections('Documentary', ['Music', 'Sport', 'War', 'History'])
    this.genreGraph.addConnections('Drama', ['Action', 'Adventure', 'Biography', 'Crime', 'History', 'Music', 'Musical', 'Romance', 'Sport', 'War'])
    this.genreGraph.addConnections('Family', ['Comedy', 'Animation', 'Adventure', 'Fantasy', 'Sport', 'Musical'])
    this.genreGraph.addConnections('Fantasy', ['Adventure', 'Animation', 'Comedy', 'Family'])
    this.genreGraph.addConnections('History', ['Adventure', 'Biography', 'Documentary', 'Drama', 'Music', 'Sport', 'War', 'Western'])
    this.genreGraph.addConnections('Horror', ['Mystery', 'Thriller', 'Sci-Fi'])
    this.genreGraph.addConnections('Musical', ['Music', 'Drama', 'Fantasy', 'Romance'])
    this.genreGraph.addConnections('Music', ['Biography', 'Documentary', 'Drama', 'History', 'Romance'])
    this.genreGraph.addConnections('Mystery', ['Crime', 'Horror', 'Thriller'])
    this.genreGraph.addConnections('Romance', ['Action', 'Biography', 'Comedy', 'Drama', 'Musical', 'Music'])
    this.genreGraph.addConnections('Sci-Fi', ['Action', 'Adventure', 'Horror', 'Thriller'])
    this.genreGraph.addConnections('Sport', ['Biography', 'Documentary', 'Drama', 'Family', 'History'])
    this.genreGraph.addConnections('Thriller', ['Crime', 'Horror', 'Mystery', 'Sci-Fi', 'War'])
    this.genreGraph.addConnections('War', ['Action', 'Biography', 'Documentary', 'Drama', 'History', 'Thriller'])
    this.genreGraph.addConnections('Western', ['Action', 'Biography', 'History'])
  }

  toRelationship (json) {
    const promotions = json[0]._fields[2].properties.promotions
    const movieId1 = json[0]._fields[0].properties.imdbId
    const movieId2 = json[0]._fields[1].properties.imdbId
    return {
      id1: movieId1,
      id2: movieId2,
      promotions: promotions
    }
  }

  toMovieRecommendationList (json) {
    const recommendationList = {}
    let i = 0
    while (json[i] !== undefined) {
      recommendationList[i + 1] = json[i]._fields[0].path.end.properties.title
      i++
    }
    return recommendationList
  }
}

module.exports = GrafMuvi
