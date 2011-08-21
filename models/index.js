var fs = require('fs'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    mongoose = require('mongoose'),
    modelsPath = './models/',
    eventEmitter = new EventEmitter(),
    models;

function connect() {
  mongoose.connect(process.env.MONGOHQ_URL, function (err) { 
    if (err) {
      console.log('connection err: ' + err); 
    } else {
      console.log('connected to db');
    }
  });
}

function modelFile(fileName, models) {
  var that = this, pattern = new RegExp("^(((?!Schema|index).)+)\\.js$"), 
      name, model, modelSchema, OrmModel;

  that.require = function() {
    if (fileName.match(pattern)) {
      name = RegExp.$1;
      console.log('loading model ' + name);
      model = require('./' + name);
    }
    return that;
  };

  that.requireSchema = function() {
    if (name && model) {
      modelSchema = require('./' + name + 'Schema');
    }
    return that;
  };

  that.createOrmModel = function() {
    if (name && modelSchema) {
      OrmModel = mongoose.model(name, modelSchema);
    }
    return that;
  };

  that.createModel = function() {
    if (model && OrmModel && modelSchema) {
      models[name] = models.modelWrapper(model, OrmModel, model(), modelSchema);
    }
    return that;
  };

  that.notifyLoaded = function() {
    if (name && model && modelSchema && OrmModel) {
      eventEmitter.emit('model-loaded', name, models[name]);
    }
    return that;
  };

  return that;
}

models = function() {
  var that = {};

  that.on = function(event, callback) {
    eventEmitter.on(event, callback);
    return that;
  };
  that.removeListener = function(event, listener) {
    eventEmitter.removeListener(event, listener);
    return that;
  };
  that.load = function() {
    connect();
    fs.readdir(modelsPath, function(err, files) {
      files.forEach(function(file) {
        modelFile(file, that).require().requireSchema().createOrmModel().createModel().notifyLoaded();
      });
    });
    return that;
  };
  return that;
}();

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createFindByFunc(name, model) {
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
}

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

module.exports = models;
