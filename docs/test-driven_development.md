# :ballot\_box\_with\_check: How is code tested?

## API testing

Tests are located in file _/\_\_test\_\_/api.test.js_. Checks file: _/src/api.js_. It checks the functionality of API \(generating output data form, check functions for requests\). It uses example files \(located in folder _/\_\_test\_\_/test\_files_\).

## Server testing

Tests are located in file _/\_\_test\_\_/server.test.js_. Checks file: _/src/api/server.js_. Before the execution of tests, it fills the database with "fake" data and after the tests the "fake" data is erased. It includes end-to-end tests for API requests \(including checks if request is appropriate\).

## Database testing

Tests are located in file _/\_\_test\_\_/database.test.js_. Checks file: _/src/api/database.js_. It also fills the database with data before the tests. It includes checking database connection and query testing with generated data.

## Structure testing

Tests are located in file _/\_\_test\_\_/graph.test.js_. Checks file: _/src/api/graph.js_. Tests functionality of working with graphs which is used in checking if request is appropriate with genre connections.

