# :movie_camera: GrafMuvi
- License: [![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
- Version: ![version](https://img.shields.io/badge/version-0.4.1-blue)
- Travis Build: [![Build Status](https://travis-ci.com/lzontar/GrafMuvi.svg?branch=master)](https://travis-ci.com/lzontar/GrafMuvi)
- Shippable: [![Run Status](https://api.shippable.com/projects/5d950376945f6b00077d2707/badge?branch=master)](https://app.shippable.com/github/lzontar/GrafMuvi/dashboard)
- Coverage: [![Coverage Status](https://coveralls.io/repos/github/lzontar/GrafMuvi/badge.svg?branch=master)](https://coveralls.io/github/lzontar/GrafMuvi?branch=master)
## :bulb: What's the idea?
With more and more movies available the answer to "What movie should I watch :interrobang:" isn't getting any simpler. That is why I decided to develop **GrafMuvi**, a web service or more precisely a movie recommendation *RESTful API*, which will support creating, posting, deleting and retrieving movie recommendations. But where will we get the data? Service will store data about movie recommendations using graph structures, because the recommendation system will be based on associations. *GrafMuvi* will support the ability to create and post a promotion of a connection between two movies and store the number of these promotions. The main objective is retrieving a list of similar movies to the one we already watched, which will be ordered from the most possible candidate to the least possible. Sort will be based on the distance between two nodes in our graph database and the number of associations/promotions. Service will also support downgrading and eventually deleting a connection between movies if enough requests of downgrading will be made.
Additionally when posting a promotion it checks:
- Whether plots are similar enough (based on pre-trained word embedding method and cosine vector similarity),
- Whether movie genres do not exclude each others (f.e. promoting a connection between a family movie and horror movie would be Irreasonable).

Because the same person cannot finish watching a lot of movies in a short period of time (like 30 minutes) and since associations are best if memory of a movie plot is still fresh we do not allow the same IP remote address more than 20 consecutive requests with less than 30 minutes between each other.

Check out the [example](https://github.com/lzontar/GrafMuvi/blob/master/Example.pdf) of how service can be used.
## :page_with_curl: How can I use it?
[Documentation of GrafMuvi web service](https://grafmuvi.docs.apiary.io/#) (developed using *Apiary*).
### Toolset documentation
- [Construction tools](https://github.com/lzontar/GrafMuvi/blob/master/docs/Construction_tools.md)
- [CI/CD](https://github.com/lzontar/GrafMuvi/blob/master/docs/CI.md)
- [Buildtool](https://github.com/lzontar/GrafMuvi/blob/master/docs/Buildtool.md)
- [Test-driven development](https://github.com/lzontar/GrafMuvi/blob/master/docs/Test-driven_development.md)
- [Deployment](https://github.com/lzontar/GrafMuvi/blob/master/docs/Deployment.md)

## :blue_book: What development techniques will be used?
- RESTful API design
- Test-driven development
- Continuous integration and deployment
- Logging services
- Storing data with NoSQL, graph database
- Deployment using PaaS

## Construction tool
```
buildtool: gulpfile.js
```
## Application deployment
```
Despliegue: https://grafmuvi.herokuapp.com
```

## :sos: Wish to contribute?
### Environment setup
1. Fork repository and pull the content
2. Execute
   ```
   $ npm install
   ```
3. Install Gulp:
   ```
   $ npm install -g gulp
   ```
### Make changes
1. Pull the latest version of repository
2. Make changes:
   - Use test-driven development
   - Use scripts that are described below
   - Test code manually
3. After testing, commit to your forked repository
4. Create a Pull Request to branch **contributions**
### :link: Check out my other projects
Check out my other projects at my GitHub Pages website [lzontar.github.io](https://lzontar.github.io):star:.
