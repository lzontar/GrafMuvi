## :hammer_and_wrench: What tools will be used for development?
### JavaScript
As the main programming language we will use [JavaScript](https://www.javascript.com/). With its grand community *JavaScript* appears to be one of the main (if not the main) web development languages.
### Node.js
[Nodej.js](https://nodejs.org/en/) is an open-source JavaScript run-time environment, that executes *JavaScript* outside of a browser. It runs server-side, which is convenient for developing RESTful APIs like our own.  
### Express
[Express](http://expressjs.com/) is a web framework for *Node.js*. It provides several HTTP utility methods and middleware and therefore makes creating an API easier.
### Continuous integration
[Continuous integration](https://en.wikipedia.org/wiki/Continuous_integration)(CI) is a development practice that is based on a frequent integration of code into a shared repository. Each commit to this repository is checked by an automated build. We will use [Travis CI](https://travis-ci.com/) and [Shippable](https://app.shippable.com/) as our continuous integration systems. *Travis CI* is a continuous integration service which provides easy GitHub integration using YAML configuration file. We will also use  *Shippable* because of its fast build executions and easy integration of *Docker Containers*. It is also defined with YAML configuration file just as *Travis CI*. Both systems also execute build after each commit and support connection with *Neo4j* database which we are using.
### Test-driven development
Test-driven development([TDD](https://en.wikipedia.org/wiki/Test-driven_development)) is software development process which encourages developers to first write tests and then the code. This has proven to fasten and improve the development cycle. We will use TDD in our project as well, using [Jest](https://jestjs.io/) which is a JavaScript testing framework. *Jest* will be used as the main TDD tool and we will use it for most unit tests and integration tests. Furthermore we will also use [supertest](https://www.npmjs.com/package/supertest) for E2E(end-to-end) testing of HTTP requests.
### Apiary
Every service has to have a good documentation, where developers will be able to see how to use the service. For this we will use [Apiary](https://apiary.io/), which is a platform for API design, development and documentation. We will use it for documentation.
### Logging
Logging is a very useful tool, because it can develop a better understanding of how a program works. In our project we will use [Sentry](https://sentry.io/welcome/), which is an open source tool for collecting, parsing and storing logs for future and [Winston](https://www.npmjs.com/package/winston) as the logging library.
On errors with level ```fatal``` and ```error``` logged by *winston*, our service will transport issues to Sentry using [winston-sentry](https://github.com/synapsestudios/winston-sentry).
### Neo4j
One of the most fundamental parts of our RESTful API is our database. [Neo4j](https://neo4j.com/) is a graph, NoSQL database management system, which we will use in our project. Graph databases are databases that use graph structures to represent and store data. We will use a graph database to support our graph data structure, where nodes will store the information about movies and relationships between the nodes (edges) will store the information about number of promotions. Existing relationships will be used for movie recommendation.
### Gulp
[Gulp](https://gulpjs.com/) is a tool for automating repetitive tasks during development. It is 'The streaming build system'. Just as *npm* it uses Node streams to read files and pipes the data to output files. It relies heavily on streams, pipes and asynchronous code. We will use it for automating simple tasks like starting the server, restarting/stopping it, testing etc.
### PM2
[pm2](https://pm2.keymetrics.io/) is an advanced, production daemon process manager for Node.js. It ensures to keep our application online and it can do it forever. It provides monitorization over all the processes that are open using *pm2* and easy reloading of applications in production phase.
### Heroku
[Heroku](https://www.heroku.com/) is a cloud PaaS (platform as a service). PaaS is one of cloud computing services, that provides a platform, where customers can develop, run and manage applications. In our project we will use for deployment. Using [GrapheneDB](https://www.graphenedb.com/) Heroku Add-on we will also deploy our Neo4j database.
### Microsoft Azure
We want this project to have a cloud infrastructure and we will use [Microsoft Azure](https://azure.microsoft.com/en-us/) to implement it. 
