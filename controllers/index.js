
var fs = require('fs'),
    util = require('util'),
    controllersPath = './controllers',
    controllerClasses = {},
    models = {};

function model(name) {
  var modelInstance = models[name];
  if (!model) {
    throw 'Model is not defined or not loaded for ' + name;
  }
  return modelInstance;
}

function controller(name, model) {
  var klass = controllerClasses[name];
  if (!klass) {
    throw 'Controller is not defined or not loaded for ' + name;
  }
  return klass(model);
}

function createController(name) {
  console.log('creating controller instance: ' + name);
  this[name] = controller(name, model(name));
  return this[name];
}

var controllers = {
  find: function(name) {
    return this[name] || createController(name);
  },

  modelAssoc:  function(name, model) {
    console.log('recieved model: ' + name);
    models[name] = model;
  }
};

fs.readdir(controllersPath, function(err, files) {
  var pattern = new RegExp("(.+).js$"), name, controller;
  files.forEach(function(file) {
    if ('index.js' !== file && file.match(pattern)) {
      name = RegExp.$1;
      console.log('loading controller: ' + name);
      controller = require('./' + name);
      controllerClasses[name] = controller;
    }
  });
});

module.exports = controllers;
