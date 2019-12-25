# :repeat: How is Continuous integration technique used?

[Continuous integration](https://en.wikipedia.org/wiki/Continuous_integration)\(CI\) is a development practice that is based on a frequent integration of code into a shared repository. Each commit to this repository is checked by an automated build. We will use [Travis CI](https://travis-ci.com/) and [Shippable](https://app.shippable.com/) as our continuous integration systems. _Travis CI_ is a continuous integration service which provides easy GitHub integration using YAML configuration file. We will also use _Shippable_ because of its fast build executions and easy integration of _Docker Containers_. It is also defined with YAML configuration file just as _Travis CI_. Both systems also execute build after each commit and support connection with _Neo4j_ database which we are using.

## Configuration

Both _CI_ tools are configured using YAML configuration file.

### Travis CI

```text
language: node_js
node_js:
- 10.16.2
install:
- npm install
cache: npm
script:
- npm test
services:
- neo4j
env:
  matrix:
  - NEO_VERSION="2.1.2"
  global:
  - secure:<OMDB_KEY>
  - secure:<GRAPHENEDB_URL>  
  - secure:<GRAPHENEDB_USER>
  - secure:<GRAPHENEDB_PASSWD>
deploy:
  provider: heroku
  api_key:
    secure:<API_KEY>    
  app: grafmuvi
  on:
    repo: lzontar/GrafMuvi
```

Travis CI configuration file consists of:

* NodeJS requirements: specifies language and NodeJS version
* Installing dependencies and caching node\_modules between processes
* Running tests
* Setting up services: _Neo4j_
* Continuous delivery using _Heroku_
* Encrypted environmental variables

### Shippable

```text
language: node_js

branches:
  only:
    - master

node_js:
  - 10.16.2

build:
  cache: true
  cache_dir_list:
    - /node_modules
  ci:
    - npm install
    - npm test
    on_success:
      - git push -f git@heroku.com:$APP_NAME.git master
env:
  global:
    - APP_NAME=grafmuvi
    - secure: <ENCRYPTED_HEROKU_API_KEY>
    - secure: <ENCRYPTED_ENV_VARIABLES>
```

Shippable configuration file consists of:

* NodeJS requirements: specifies language and NodeJS version
* Installing dependencies and caching node\_modules between processes
* Running tests
* Encrypted environmental variables
* Encrypted Heroku API key
* Continuous delivery using _Heroku_

