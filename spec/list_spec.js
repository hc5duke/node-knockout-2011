var list = require('../models/list.js'),
    util = require('util'),
    mongoose = require('mongoose'),
    mylist;

var dummyId = function(values) {
  return function(idToFind) {
    var that = {};
    that.remove = function() {
      var obj,cnt;
      for(cnt=0;cnt<values.length;cnt++) {
        if (idToFind === values[cnt]._id) {
          obj = values[cnt];
          break;
        }
      }
      values.pop(obj);
    };
    return that;
  };
};

var dummyList = function(values) {
  var that ={};
  that.values = values;
  that.id = dummyId(values); 
  that.push = function(obj) { values.push(obj); };
  that.length = values.length;
  return that;
};

var injectDynamicFunctions = function(mylist) {
  mylist.model = function() {return {};};
  mylist.findOne = function(data, callback) {
    callback(null, data);
  };
  mylist.newInstance = function(ormData) {
    return list(ormData);
  };
  mylist.newModel = function() {
    return {};
  };
};

beforeEach(function() {
  mylist = list({user: '123', products: []});
  injectDynamicFunctions(mylist);
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
    mylist.products = dummyList([]); 
    mylist.add({ _id: '123', name:'blah'});
    mylist.remove({id: '123'});
    expect(mylist.products.length).toBe(0);
  });

  it('should call my callback after finding user successfully', function() {
    mylist.findByUser('123', function(err, data) {
      expect(data.user).toBe('123');
    });
  });

  it('should call my callback after finding user with error', function() {
    mylist.findOne = function(data, callback) {
      console.log('my dummy');
      callback('error', data);
    };
    mylist.findByUser('123', function(err, data) {
      expect(err).toBe('error');
    });
  });
});
