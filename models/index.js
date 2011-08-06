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

var createFindByFunc = function(name, model) {
  return function(value, callback) {
    var criteria = {};
    criteria[name] = value;
    console.log('findBy' + name + ' using criteria ' + util.inspect(criteria));
    model.findOne(criteria, function(err, modelData) {
      var modelObj;
      if (err || !modelData) {
        console.log('error finding ' + name + ': ' + err + ': ' + modelData);
        modelData = model.newModel();
      }
      modelObj = model.newInstance(modelData);
      callback(err, modelObj);
    });
  };
};

models.addFindByMethods = function(toModel, fromSchema) {
  console.log('adding findBy methods');
  var modelTree = fromSchema.tree;
  for (var name in modelTree) {
    if(modelTree.hasOwnProperty(name) && !(modelTree[name] instanceof Function)) { 
      console.log('adding findBy' + capitaliseFirstLetter(name));
      toModel['findBy' + capitaliseFirstLetter(name)] = createFindByFunc(name, toModel); 
    }
  }
};

models.modelWrapper = function(modelFunc, OrmModel, modelInst, modelSchema) {
  var that = modelInst;

  that.findOne = function(criteria, callback) {
    OrmModel.findOne(criteria, callback);
  };

  that.newModel = function() {
    return new OrmModel(); 
  };

  that.newInstance = function(ormModelInst) { 
    return models.modelWrapper(modelFunc, OrmModel, modelFunc(ormModelInst), modelSchema);
  };

  models.addFindByMethods(that, modelSchema);

  return that;
};

fs.readdir(modelsPath, function(err, files) {
  var pattern = new RegExp("^(((?!Schema|index).)+)\\.js$"), name, model, modelSchema, OrmModel;
  files.forEach(function(file) {
    if (file.match(pattern)) {
      name = RegExp.$1;
      console.log('loading model: ' + name);
      model = require('./' + name);
      modelSchema = require('./' + name + 'Schema');
      OrmModel = mongoose.model(name, modelSchema);
      models[name] = models.modelWrapper(model, OrmModel, model(), modelSchema);
      eventEmitter.emit('model-loaded', name, models[name]);
    }
  });
});

module.exports = models;
