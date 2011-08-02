var list = require('../models/list.js');

var mylist;

beforeEach(function() {
  mylist = list({user: '123', products: []});
});

describe('list', function() {
  it('should have a findByUser method', function() {
    expect(mylist.findByUser).toBeTruthy();
  });

  it('should have the supplied user', function() {
    expect(mylist.user).toBe('123');
  });

  it('should allow products to be added to the list', function() {
    mylist.add({name:'blah'});
    expect(mylist.products.length).toBe(1);
  });

  it('should allow products to be added to the list', function() {
    mylist.add({name:'blah'});
    mylist.remove({name:'blah'});
    expect(mylist.products.length).toBe(0);
  });

  it('should call my callback after finding user successfully', function() {
    listModel = {findOne: function(data, callback) {
        console.log('my dummy');
        callback(null, data);
      }
    };
    mylist.findByUser('123', function(err, data) {
      expect(data.user).toBe('123');
    });
  });

  it('should call my callback after finding user with error', function() {
    listModel = {findOne: function(data, callback) {
        console.log('my dummy');
        callback('error', data);
      }
    };
    mylist.findByUser('123', function(err, data) {
      expect(err).toBe('error');
    });
  });
});
