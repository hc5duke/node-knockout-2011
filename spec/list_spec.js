var list = require('../models/list.js'),
    util = require('util'),
    mongoose = require('mongoose');

var mylist;

beforeEach(function() {
  mylist = list({user: '123', products: []});
  mylist.model = function() {return {};};
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
    mylist.add({ _id: '123', name:'blah'});
    // todo - need to figure a good way to mock a mongoose object list
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
