var modelLoader = require('../models'),
    util = require('util'),
    mongoose = require('mongoose');

var myModel = {},
    OrmModel = function() {
    },
    callback = jasmine.createSpy();

OrmModel.findOne = function(criteria, callback){ callback(false, {}); };

beforeEach(function() {
});

describe('model loader (index.js)', function() {

  describe('modelWrapper', function() {

    beforeEach(function() {
      modelLoader.modelWrapper(null, OrmModel, myModel, null, function(){});
    });

    it('should inject findOne method', function() {
      expect(myModel.findOne).toBeDefined();
    });

    it('should inject newModel function', function() {
      expect(myModel.newModel).toBeDefined();
    });

    it('should inject newInstance function', function() {
      expect(myModel.newInstance).toBeDefined();
    });

    describe('findOne method', function() {

      it('should call the OrmModels find one with the criteria and callback', function() {
        spyOn(OrmModel, 'findOne');
        myModel.findOne({}, callback);
        expect(OrmModel.findOne).toHaveBeenCalled();
      });

      it('should call my callback on success', function() {
        myModel.findOne({}, callback);
        expect(callback).toHaveBeenCalled();
      });

      it('should call my callback on error', function() {
        OrmModel.findOne = function(criteria, callback){ callback(true, {}); };
        myModel.findOne({}, callback);
        expect(callback).toHaveBeenCalled();
      });

    });
  });

  describe('addFindByMethods', function() {

    beforeEach(function() {
      modelLoader.addFindByMethods(myModel, {tree: {user: ''}});
      spyOn(myModel, 'newInstance');
      spyOn(myModel, 'newModel');
    });

    it('should inject findByUser method', function() {
      expect(myModel.findByUser).toBeDefined();
    });
 
    it('should call callback after finding successfully', function() {
      myModel.findByUser('123', callback);
      expect(callback).toHaveBeenCalled();
    });
 
    it('should call newInstance after finding successfully', function() {
      myModel.findByUser('123', callback);
      expect(myModel.newInstance).toHaveBeenCalled();
    });
  
    it('should call newModel after not finding', function() {
      OrmModel.findOne = function(criteria, callback){ callback(false, undefined); };
      myModel.findByUser('123', callback);
      expect(myModel.newModel).toHaveBeenCalled();
    });
 
    it('should call newInstance after not finding', function() {
      OrmModel.findOne = function(criteria, callback){ callback(false, undefined); };
      myModel.findByUser('123', callback);
      expect(myModel.newInstance).toHaveBeenCalled();
    });
  
    it('should call newModel after error', function() {
      OrmModel.findOne = function(criteria, callback){ callback(true, {}); };
      myModel.findByUser('123', callback);
      expect(myModel.newModel).toHaveBeenCalled();
    });
 
    it('should call newInstance after error', function() {
      OrmModel.findOne = function(criteria, callback){ callback(true, {}); };
      myModel.findByUser('123', callback);
      expect(myModel.newInstance).toHaveBeenCalled();
    });

  });
});
