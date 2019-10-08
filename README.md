# :movie_camera: GrafMuvi
## :bulb: What's the idea?
With more and more movies available the answer to "What movie should I watch :interrobang:" isn't getting any simpler. That is why I decided to develop **GrafMuvi**, a web service or more precisely a movie recommendation *RESTful API*, which will support creating, posting, deleting and retrieving movie recommendations. But where will we get the data? Service will store data about movie recommendations using graph structures, because the recommendation system will be based on associations. *GrafMuvi* will support the ability to create and post a promotion of a connection between two movies and store the number of these promotions. The main objective is retrieving a list of similar movies to the one we already watched, which will be ordered from the most possible candidate to the least possible. Sort will be based on the distance between two nodes in our graph database and the number of associations/promotions. Service will also support downgrading and eventually deleting a connection between movies if enough requests of downgrading will be made.
Check out the [example](https://github.com/lzontar/GrafMuvi/blob/master/Example.pdf) of how service can be used.
## :page_with_curl: How can I use it?
Documentation of [GrafMuvi](https://grafmuvi.docs.apiary.io/#) web service (developed using *Apiary*).
## :blue_book: What development techniques will be used?
- RESTful API design
- Test-driven development
- Continuous integration
- Logging services
- Storing data with NoSQL, graph database
## :hammer_and_wrench: What tools will be used for development?
### JavaScript
As the main programming language we will use [JavaScript](https://www.javascript.com/). With its grand community *JavaScript* appears to be one of the main (if not the main) web development languages.
### Node.js
[Nodej.js](https://nodejs.org/en/) is an open-source JavaScript run-time environment, that executes *JavaScript* outside of a browser. It runs server-side, which is convenient for developing RESTful APIs like our own.  
### Express
[Express](http://expressjs.com/) is a web framework for *Node.js*. It provides several HTTP utility methods and middleware and therefore makes creating an API easier.
### Continuous integration
[Continuous integration](https://en.wikipedia.org/wiki/Continuous_integration)(CI) is a development practice that is based on a frequent integration of code into a shared repository. Each commit to this repository is checked by an automated build. We will use [Travis CI](https://travis-ci.com/) and [Shippable](https://docs.gitlab.com/ee/ci/) as our continuous integration systems. *Travis CI* is a continuous integration service which provides easy GitHub integration using YAML configuration file. We will also use  *Shippable* because of its 
### Test-driven development
Test-driven development([TDD](https://en.wikipedia.org/wiki/Test-driven_development)) is software development process which encourages developers to first write tests and then the code. This has proven to fasten and improve the development cycle. We will use TDD in our project as well, using [Jest](https://jestjs.io/) which is a JavaScript testing framework. *Jest* will be used as the main TDD tool and we will use it for most unit tests and integration tests. Furthermore we will also use [supertest](https://www.npmjs.com/package/supertest) for E2E(END-To-END) testing of HTTP requests.
### Building
#### Babel
#### Nodemon
### Apiary
Every service has to have a good documentation, where developers will be able to see how to use the service. For this we will use [Apiary](https://apiary.io/), which is a platform for API design, development and documentation. We will use it for documentation.
### Logging
Logging is a very useful tool, because it can develop a better understanding of how a program works. In our project we will use [Logstash](https://www.elastic.co/products/logstash), which is an open source tool for collecting, parsing and storing logs for future and [Winston](https://www.npmjs.com/package/winston) as the logging library.
### Neo4j
One of the most fundamental parts of our RESTful API is our database. [Neo4j](https://neo4j.com/) is a graph, NoSQL database management system, which we will use in our project. Graph databases are databases that use graph structures to represent and store data.
### Microsoft Azure
We want this project to have a cloud infrastructure and we will use [Microsoft Azure](https://azure.microsoft.com/en-us/) to implement it.

## :sos: Wish to contribute?
### Environment setup
1. Fork repository and pull the content
2. Execute
   ```
   npm install
   ```
### Make changes
1. Pull the latest version of repository
2. Make changes:
   - Use test-driven development
   - To run tests execute:
     ```
     npm test
     ```
   - Test your code manually
     - Run the server using *node*:
       ```
       npm start
       ```
     - Run the server in *dev* mode using [nodemon](https://nodemon.io/):
       ```
       npm run dev
       ```
   - Build project using [Babel](https://babeljs.io/):
     ```
     npm run build
     ```
3. After testing, commit to your forked repository
4. Create a Pull Request to branch **contributions**

### :link: Check out my other projects
Check out my other projects at my GitHub Pages website [lzontar.github.io](https://lzontar.github.io):star:.
