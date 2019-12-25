## :wrench: What buildtool is used?
For repetitive tasks like testing, building and starting a server we can define scripts to automate these tasks. *Gulp* uses ```gulfile.js``` to recognize and run the scripts. As it seems appropriate to automate the development process as much as possible, we will include some scripts in our project as well. Each task has a symbol "&" at the end of it, soo that the command is ran in background and the terminal doesn't get blocked.

To run scripts through  we first have to install Gulp:
```
$npm -g install gulp
```
### Running tests
Using gulp we can execute tests (unit tests, integration tests and E2E tests). Gulp uses *gulp-jest* dependency which is a Gulp plugin for Jest test library. To run tests using *Jest* run (it executes ```jest --detectOpenHandles```):
```
$ gulp test &
```
It also executes *pretest* script, which checks coding style using [StandardJS](https://standardjs.com/). *StandardJS* applies multiple rules to our code. Check them out on the [Rules section of StandardJS website](https://standardjs.com/rules.html). We can also execute only the *pretest* script just to check syntax in our code. We do that by executing:
```
$ gulp pretest &
```
This command executes standard ```standard ./src```, with which we check the syntax in all the files in *./src* folder.

Using *StandardJS* it is also very simple to fix our code according to the rules. To apply the rules automatically, you can execute:
```
$ gulp fix-lint &
```
Fix-lint command executes ```standard --fix ./src```.

### Running build
[Babel](https://babeljs.io/) is JavaScript tool for compiling code into a backwards compatible version of JavaScript. We will use it in build to compile our ES6 code. To build project run:
```
$ gulp build &
```
It executes ```babel src --out-dir dist``` -> builds /src folder to /dist folder. *Babel* is configured using ```babel.config.js```, where we enable the presets.

### Running server
[pm2](https://pm2.keymetrics.io/) is a daemon process manager which helps too keep our application alive forever and to reload applications without downtime. This is a perfect tool for us, because we want to have our API available at all times. We will be using it for the start of our server (```pm2 start ./src/api/server.js --name GrafMuvi```). Start server by executing:
```
$ gulp start &
```

### Running server in development mode
While developing restarting application due to code changes can be frustrating. *pm2* provides ```--watch``` flag which instructs the server to reload automatically on each code change. To run project in *dev* mode run:
```
$ gulp dev &
```
It executes ```pm2 start ./src/api/server.js --watch``` which executes pm2 start while watching for changes in filesystem and reloading when changes are applied.

### More server operations
There are plenty other operations we can do on our servers:
- ```$ gulp status &``` with which we can check status of our server (it executes ```pm2 ls```)
- ```$ gulp restart &``` with which we can restart (it executes ```pm2 restart GrafMuvi```)
- ```$ gulp stop &``` with which we can stop our server (it executes ```pm2 stop GrafMuvi```)
