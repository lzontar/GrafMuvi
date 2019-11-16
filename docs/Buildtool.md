## :wrench: What buildtool is used?
For repetitive tasks like testing, building and starting a server we can define scripts to automate these tasks. *Gulp* uses ```gulfile.js``` to recognize and run the scripts. As it seems appropriate to automate the development process as much as possible, we will include some scripts in our project as well. Each task has a symbol "&" at the end of it, soo that the command is ran in background and the terminal doesn't get blocked.

To run scripts through  we first have to install Gulp:
```
$npm -g install gulp
```
### Running tests
To run tests using *Jest* run:
```
$ gulp test &
```
It also executes *pretest* script, which checks coding style using [StandardJS](https://standardjs.com/). *StandardJS* applies multiple rules to our code. Check them out on the [Rules section of StandardJS website](https://standardjs.com/rules.html). Using *StandardJS* it is very simple to fix our code according to the rules. To apply the rules automatically, you can execute:
```
$ gulp fix-lint &
```
It executes ```standard --fix ./src```.

### Running build
[Babel](https://babeljs.io/) is JavaScript tool for compiling code into a backwards compatible version of JavaScript. We will use it in build to compile our ES6 code. To build project run:
```
$ gulp build &
```
It executes ```babel src --out-dir dist``` -> builds /src folder to /dist folder. *Babel* is configured using ```babel.config.js```, where we enable the presets.

### Running server in development mode
[nodemon](https://nodemon.io/) is a tool that improves developing speed by automatically restarting node application every time file or directory changes are detected. To run project in *dev* mode run:
```
$ gulp dev &
```
It executes ```pm2 start ./src/api/server.js --watch``` which executes pm2 start while watching for changes in filesystem and reloading when changes are applied.

### Running server
We will be using *pm2* for start of the server(```pm2 start ./src/api/server.js```). Start server by executing:
```
$ gulp start &
```

### Server status
We can also check the status of our server using *pm2* (automated with *gulp*):
```
$ gulp status &
```
