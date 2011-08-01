var models = require('../models/list.js');

describe('models', function() {
  it('should have a list model', function() {
    expect(models.list).toBeTruthy();
  });
});
