const Graph = require('./structure/graph.js')

const fs = require('fs');
var appRoot = require('app-root-path')


const logger = require('./logging/logger')


class GrafMuvi {
  constructor () {
    this.generateGenreGraph()
    this.meanVectorLength = 300;
    this.WordVectors = JSON.parse(fs.readFileSync(`${appRoot}/data/model.json`))
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

    return result
  }

  arePlotsSimilar(plot1, plot2) {
    let plotArray1 = this.removeStopWordsAndPunctuations(plot1)
    let plotArray2 = this.removeStopWordsAndPunctuations(plot2)

    let meanVector1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    let vectorSize1 = 0

    let meanVector2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    let vectorSize2 = 0

    plotArray1.forEach((x) => {
      if(this.WordVectors[x]) {
        for(let i = 0; i < this.meanVectorLength; i++) {
            meanVector1[i] += this.WordVectors[x][i]
        }
        vectorSize1 += 1
      }
    })
    plotArray2.forEach((x) => {
      if(this.WordVectors[x]) {
        for(let i = 0; i < this.meanVectorLength; i++) {
            meanVector2[i] += this.WordVectors[x][i]
        }
        vectorSize2 += 1
      }
    })
    return this.cosineVectorSimilarity(meanVector1, meanVector2, vectorSize1, vectorSize2) > 0.5 ? true : false
  }

  cosineVectorSimilarity(vec1, vec2, vecSize1, vecSize2) {
    let dotProduct = 0
    let vectorLength1 = 0
    let vectorLength2 = 0
    for(let i = 0; i < this.meanVectorLength; i++) {
        let el1 = (vec1[i]/vecSize1)
        let el2 = (vec2[i]/vecSize2)
        dotProduct += el1*el2
        vectorLength1 += el1 * el1
        vectorLength2 += el2 * el2
    }
    return dotProduct / (Math.sqrt(vectorLength1) * Math.sqrt(vectorLength2))
  }

  areGenresSimilar(genresJson1, genresJson2) {
    //get array of genre strings
    let genres1 = []
    Object.keys(genresJson1).forEach((key) => {
      genres1.push(genresJson1[key])
    });

    //get array of genre strings
    let genres2 = []
    Object.keys(genresJson2).forEach((key) => {
      genres2.push(genresJson2[key])
    });
    return this.genreGraph.compareGenres(genres1, genres2)
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

  checkIP(ip) {
    let result = true
    const fs = require('fs')
    const jsonString = fs.readFileSync(`${appRoot}/data/ip.json`)

    const ipList = JSON.parse(jsonString)
    const time = new Date().getTime()

    // If IP is already on the list
    if(ipList[ip]) {
      // get number of previous requests that were not more than 30 minutes apart
      let nOfRequests = ipList[ip].nOfRequests
      // get minutes passed from the last request
      const minPassed = this.getTimePassed(ipList[ip].time) / 60000

      // if there was no request from that IP for over 30 minutes reset nOfRequests to 0
      if(minPassed > 30.0) {
        nOfRequests = 0
        this.writeToJson(`${appRoot}/data/ip.json`, nOfRequests, time, ip, ipList)
      }
      //if there was more than 20 requests that were not more than 30 minutes apart don't allow the request
      else if(minPassed <= 30.0 && nOfRequests > 20) {
        result = false
      } else {
        nOfRequests += 1;
        this.writeToJson(`${appRoot}/data/ip.json`, nOfRequests, time, ip, ipList)
      }
    }
    // otherwise just add to json file new ip with number of request 1 and current time.
    else {
      this.writeToJson(`${appRoot}/data/ip.json`, 1, time, ip, ipList)
    }
    return result
  }

  getTimePassed(time) {
    const today = new Date();
    const time2 = today.getTime()
    //return milliseconds passed
    return time2 - time
  }

  writeToJson(filePath, nOfRequests, time, ip, ipList) {
    ipList[ip] = {
      time: time,
      nOfRequests: nOfRequests
    }

    fs.writeFileSync(filePath, JSON.stringify(ipList))
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
