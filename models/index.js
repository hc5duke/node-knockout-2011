var fs = require('fs'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    mongoose = require('mongoose'),
    modelsPath = './models/',
    eventEmitter = new EventEmitter(),
    ObjectID = require('mongodb').BSONPure.ObjectID;

function connect() {
  mongoose.connect(process.env.MONGOHQ_URL, function (err) { 
    if (err) {
      console.log('connection err: ' + err); 
    } else {
      console.log('connected to db');
    }
  });
}

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createFindByIdFunc(model) {
  return function(value, callback) {
    var criteria = {_id: ObjectID.createFromHexString(value)};
    console.log('findById using criteria ' + util.inspect(criteria));
    model.findOne(criteria, function(err, modelData) {
      var modelObj;
      console.log('found ' + JSON.stringify(modelData));
      if (err || !modelData) {
        console.log('error finding by id: ' + err + ': ' + modelData);
        modelData = model.newModel();
        console.log('created new model: ' + JSON.stringify(modelData));
      }
      modelObj = model.newInstance(modelData);
      callback(err, modelObj);
    });
  };
}

function createFindByFunc(name, model) {
  return function(value, callback) {
    var criteria = {};
    criteria[name] = value || -1;
    console.log('findBy' + name + ' using criteria ' + util.inspect(criteria));
    model.findOne(criteria, function(err, modelData) {
      var modelObj;
      console.log('found ' + JSON.stringify(modelData));
      if (err || !modelData) {
        console.log('error finding ' + name + ': ' + err + ': ' + modelData);
        modelData = model.newModel();
        console.log('created new model: ' + JSON.stringify(modelData));
      }
      modelObj = model.newInstance(modelData);
      callback(err, modelObj);
    });
  };
}

function addFindByMethods(toModel, fromSchema) {
  console.log('adding findBy methods');
  var modelTree = fromSchema.tree, findByFuncName;
  for (var name in modelTree) {
    if(modelTree.hasOwnProperty(name) && !(modelTree[name] instanceof Function)) { 
      findByFuncName = 'findBy' + capitaliseFirstLetter(name);
      console.log('adding ' + findByFuncName);
      console.log('existing function: ' + toModel[findByFuncName]);
      if (name === 'id' || name === '_id') {
        toModel[findByFuncName] = createFindByIdFunc(toModel);
      } else {
        toModel[findByFuncName] = createFindByFunc(name, toModel); 
      }
    }
  }
}

function modelWrapper(name, modelFunc, OrmModel, modelInst, modelSchema, addFindByMethods) {
  var that = modelInst;

  that.findOne = function(criteria, callback) {
    OrmModel.findOne(criteria, callback);
  };

  that.newModel = function() {
    return new OrmModel();
    // return new mongoose.model(name, modelSchema); 
  };

  that.newInstance = function(ormModelInst) { 
    return modelWrapper(name, modelFunc, OrmModel, modelFunc(ormModelInst), modelSchema, addFindByMethods);
  };

  addFindByMethods(that, modelSchema);

  return that;
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
      models[name] = modelWrapper(name, model, OrmModel, model(), modelSchema, addFindByMethods);
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

function models() {
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

  // for testability
  that.addFindByMethods = addFindByMethods;
  that.modelWrapper = modelWrapper;

  return that;
}

module.exports = models();
