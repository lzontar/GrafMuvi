// Require the built in 'assertion' library
var assert = require('assert');
describe('Simple test', function() {
  // A string explanation of what we're testing
  it('should return -1 when the value is not present', function(){
      // Our actual test: -1 should equal indexOf(...)
    assert.equal(-1, [1,2,3].indexOf(4));
  });
});
