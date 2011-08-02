var list = require('../models/list.js');

var mylist;

beforeEach(function() {
  mylist = list({user: '123', products: []});
});

describe('list', function() {
  it('list', function() {
    expect(mylist.findByUser).toBeTruthy();
  });

  it('should have the supplied user', function() {
    expect(mylist.user).toBe('123');
  });

  it('should allow products to be added to the list', function() {
    mylist.add({name:'blah'});
    expect(mylist.products.length).toBe(1);
  });
});
