# :wrench: What buildtool is used?

For repetitive tasks like testing, building and starting a server we can define scripts to automate these tasks. _Gulp_ uses `gulfile.js` to recognize and run the scripts. As it seems appropriate to automate the development process as much as possible, we will include some scripts in our project as well. Each task has a symbol "&" at the end of it, soo that the command is ran in background and the terminal doesn't get blocked.

To run scripts through we first have to install Gulp:

```text
$npm -g install gulp
```

## Running tests

Using gulp we can execute tests \(unit tests, integration tests and E2E tests\). Gulp uses _gulp-jest_ dependency which is a Gulp plugin for Jest test library. To run tests using _Jest_ run \(it executes `jest --detectOpenHandles`\):

```text
$ gulp test &
```

It also executes _pretest_ script, which checks coding style using [StandardJS](https://standardjs.com/). _StandardJS_ applies multiple rules to our code. Check them out on the [Rules section of StandardJS website](https://standardjs.com/rules.html). We can also execute only the _pretest_ script just to check syntax in our code. We do that by executing:

```text
$ gulp pretest &
```

This command executes standard `standard ./src`, with which we check the syntax in all the files in _./src_ folder.

Using _StandardJS_ it is also very simple to fix our code according to the rules. To apply the rules automatically, you can execute:

```text
$ gulp fix-lint &
```

Fix-lint command executes `standard --fix ./src`.

## Running build

[Babel](https://babeljs.io/) is JavaScript tool for compiling code into a backwards compatible version of JavaScript. We will use it in build to compile our ES6 code. To build project run:

```text
$ gulp build &
```

It executes `babel src --out-dir dist` -&gt; builds /src folder to /dist folder. _Babel_ is configured using `babel.config.js`, where we enable the presets.

## Running server

[pm2](https://pm2.keymetrics.io/) is a daemon process manager which helps too keep our application alive forever and to reload applications without downtime. This is a perfect tool for us, because we want to have our API available at all times. We will be using it for the start of our server \(`pm2 start ./src/api/server.js --name GrafMuvi`\). Start server by executing:

```text
$ gulp start &
```

## Running server in development mode

While developing restarting application due to code changes can be frustrating. _pm2_ provides `--watch` flag which instructs the server to reload automatically on each code change. To run project in _dev_ mode run:

```text
$ gulp dev &
```

It executes `pm2 start ./src/api/server.js --watch` which executes pm2 start while watching for changes in filesystem and reloading when changes are applied.

## More server operations

There are plenty other operations we can do on our servers:

* `$ gulp status &` with which we can check status of our server \(it executes `pm2 ls`\)
* `$ gulp restart &` with which we can restart \(it executes `pm2 restart GrafMuvi`\)
* `$ gulp stop &` with which we can stop our server \(it executes `pm2 stop GrafMuvi`\)

