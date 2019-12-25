## :ballot_box_with_check: How is code tested?
#### API testing
Tests are located in file */\_\_test__/api.test.js*. Checks file: */src/api.js*. It checks the functionality of API (generating output data form, check functions for requests). It uses example files (located in folder */\_\_test__/test_files*).
#### Server testing
Tests are located in file */\_\_test__/server.test.js*. Checks file: */src/api/server.js*. Before the execution of tests, it fills the database with "fake" data and after the tests the "fake" data is erased. It includes end-to-end tests for API requests (including checks if request is appropriate).
#### Database testing
Tests are located in file */\_\_test__/database.test.js*. Checks file: */src/api/database.js*. It also fills the database with data before the tests. It includes checking database connection and query testing with generated data.
#### Structure testing
Tests are located in file */\_\_test__/graph.test.js*. Checks file: */src/api/graph.js*. Tests functionality of working with graphs which is used in checking if request is appropriate with genre connections.
