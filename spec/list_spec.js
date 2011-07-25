var shopping = require('../models/list.js');

describe('list', function() {
  it('should have products', function() {
    expect(shopping.list().products).toBeTruthy();
  });
});
