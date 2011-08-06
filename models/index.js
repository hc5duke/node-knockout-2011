var fs = require('fs'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    mongoose = require('mongoose'),
    modelsPath = './models/',
    eventEmitter = new EventEmitter(),
    models = {
      on: function(event, callback) {
        eventEmitter.on(event, callback);
      },
      removeListener: function(event, listener) {
        eventEmitter.removeListener(event, listener);
      }
    };

var capitaliseFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

var modelWrapper = function(modelFunc, OrmModel, modelInst) {
  var that = modelInst;

  that.findOne = function(criteria, callback) {
    OrmModel.findOne(criteria, callback);
  };

  that.newModel = function() {
    return new OrmModel(); 
  };

  that.newInstance = function(ormModelInst) { 
    return modelWrapper(name, modelFunc, OrmModel, modelFunc(ormModelInst));
  };

  return that;
};

fs.readdir(modelsPath, function(err, files) {
  var pattern = new RegExp("^(((?!Schema|index).)+)\\.js$"), name, model, ModelSchema, OrmModel;
  files.forEach(function(file) {
    if (file.match(pattern)) {
      name = RegExp.$1;
      console.log('loading model: ' + name);
      model = require('./' + name);
      ModelSchema = require('./' + name + 'Schema');
      OrmModel = mongoose.model(name, ModelSchema);
      models[name] = modelWrapper(model, OrmModel, model());
      eventEmitter.emit('model-loaded', name, models[name]);
    }
  });
});

module.exports = models;
