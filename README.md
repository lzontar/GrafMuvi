# :movie_camera: GrafMuvi
- License: [![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
- Version: ![version](https://img.shields.io/badge/version-0.4.1-blue)
- Travis Build: [![Build Status](https://travis-ci.com/lzontar/GrafMuvi.svg?branch=master)](https://travis-ci.com/lzontar/GrafMuvi)
- Shippable: [![Run Status](https://api.shippable.com/projects/5d950376945f6b00077d2707/badge?branch=master)](https://app.shippable.com/github/lzontar/GrafMuvi/dashboard)
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
[Continuous integration](https://en.wikipedia.org/wiki/Continuous_integration)(CI) is a development practice that is based on a frequent integration of code into a shared repository. Each commit to this repository is checked by an automated build. We will use [Travis CI](https://travis-ci.com/) and [Shippable](https://app.shippable.com/) as our continuous integration systems. *Travis CI* is a continuous integration service which provides easy GitHub integration using YAML configuration file. We will also use  *Shippable* because of its fast build executions and easy integration of *Docker Containers*. It is also defined with YAML configuration file just as *Travis CI*. Both systems also execute build after each commit and support connection with *Neo4j* database which we are using.
#### Configuration
Both *CI* tools are configured using YAML configuration file.
##### Travis CI
Travis CI configuration file consists of:
- NodeJS requirements: specifies language and NodeJS version
- Installing dependencies and caching node_modules between processes
- Running scripts: ```npm test```
- Setting up services: *Neo4j*
- Continuous delivery using *Heroku*  
##### Shippable
Shippable configuration file consists of:
- NodeJS requirements: specifies language and NodeJS version
- Installing dependencies and caching node_modules between processes
- Running scripts: ```npm test```
### Test-driven development
Test-driven development([TDD](https://en.wikipedia.org/wiki/Test-driven_development)) is software development process which encourages developers to first write tests and then the code. This has proven to fasten and improve the development cycle. We will use TDD in our project as well, using [Jest](https://jestjs.io/) which is a JavaScript testing framework. *Jest* will be used as the main TDD tool and we will use it for most unit tests and integration tests. Furthermore we will also use [supertest](https://www.npmjs.com/package/supertest) for E2E(end-to-end) testing of HTTP requests.
### Apiary
Every service has to have a good documentation, where developers will be able to see how to use the service. For this we will use [Apiary](https://apiary.io/), which is a platform for API design, development and documentation. We will use it for documentation.
### Logging
Logging is a very useful tool, because it can develop a better understanding of how a program works. In our project we will use [Sentry](https://sentry.io/welcome/), which is an open source tool for collecting, parsing and storing logs for future and [Winston](https://www.npmjs.com/package/winston) as the logging library.
On errors with level ```fatal``` and ```error``` logged by *winston*, our service will transport issues to Sentry using [winston-sentry](https://github.com/synapsestudios/winston-sentry).
### Neo4j
One of the most fundamental parts of our RESTful API is our database. [Neo4j](https://neo4j.com/) is a graph, NoSQL database management system, which we will use in our project. Graph databases are databases that use graph structures to represent and store data. We will use a graph database to support our graph data structure, where nodes will store the information about movies and relationships between the nodes (edges) will store the information about number of promotions. Existing relationships will be used for movie recommendation.
### Heroku
[Heroku](https://www.heroku.com/) is a cloud PaaS (platform as a service). PaaS is one of cloud computing services, that provides a platform, where customers can develop, run and manage applications. In our project we will use for deployment. Using [GrapheneDB](https://www.graphenedb.com/) Heroku Add-on we will also deploy our Neo4j database.
*Heroku* is configured with ```Procfile```, where we can specify commands executed during deployment. In our case it executes:
- *On release - release*: ```npm build .``` -> Executed before deployment
- *On start - web*: ```node ./src/api/server.js``` -> Executed on application startup
### Microsoft Azure
We want this project to have a cloud infrastructure and we will use [Microsoft Azure](https://azure.microsoft.com/en-us/) to implement it.

## :santa: Scripts
For repetitive tasks like testing, building and starting a server we can define scripts to automate these tasks. NPM uses *package.json* to recognize and run the scripts. As it seems appropriate to automate the development process as much as possible, we will include some scripts in our project as well.
```
buildtool: package.json
```
### Running tests
To run tests using *Jest* run:
```
npm test
```
It also executes *pretest* script, which checks coding style using [StandardJS](https://standardjs.com/). *StandardJS* applies multiple rules to our code. Check them out on the [Rules section of StandardJS website](https://standardjs.com/rules.html). Using *StandardJS* it is very simple to fix our code according to the rules. To apply the rules automatically, you can execute:
```
npm run fix
```
It executes ```npx standard --fix```.
#### API testing
Tests are located in file */__test_/api.test.js*. Checks file: */src/api/server.js*. Before the execution of tests, it fills the database with "fake" data and after the tests the "fake" data is erased. It includes end-to-end tests for API requests.
#### Database testing
Tests are located in file */__test_/database.test.js*. Checks file: */src/api/database.js*. It also fills the database with data before the tests. It includes checking database connection and query testing with generated data.
#### Structure testing
Tests are located in file */__test_/graph.test.js*. Checks file: */src/api/graph.js*. Tests functionality of processing the data returned from the database to JSON human-readable format that is returned to the user by our service. It uses example files (located in folder */__test__/test_files*).

### Running build
[Babel](https://babeljs.io/) is JavaScript tool for compiling code into a backwards compatible version of JavaScript. We will use it in build to compile our ES6 code. To build project run:
```
npm run build
```
It executes ```babel src --out-dir dist``` -> builds /src folder to /dist folder. *Babel* is configured using ```babel.config.js```, where we enable the presets.

### Running server in development mode
[nodemon](https://nodemon.io/) is a tool that improves developing speed by automatically restarting node application every time file or directory changes are detected. To run project in *dev* mode run:
```
npm run dev
```
It executes ```nodemon src/api/server.js localhost 3000``` -> starts *nodemon* localhost server at port 3000.

### Running server
We will be using simple *node* for start of the server (```node src/api/server.js```). Start server by executing:
```
npm start
```

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
   - Use scripts that are described below
   - Test code manually
3. After testing, commit to your forked repository
4. Create a Pull Request to branch **contributions**
### :link: Check out my other projects
Check out my other projects at my GitHub Pages website [lzontar.github.io](https://lzontar.github.io):star:.
