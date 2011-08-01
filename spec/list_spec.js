var shopping = require('../models/list.js');

describe('list', function() {
  it('should have a findByUser function', function() {
    expect(shopping.findByUser).toBeTruthy();
  });
});
