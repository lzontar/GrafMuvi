import {Edge} from '../src/structure/edge';

// Author: @lzontar

//test files

//-------------------------------------UNIT TESTS -------------------------------------//
test('The service should be able to call new() on Node', () => {
  const edge = new Edge();
  // Ensure constructor created the object:
  expect(edge).toBeTruthy();
});
