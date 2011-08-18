
var fs = require('fs'),
    util = require('util'),
    controllersPath = './controllers',
    controllerClasses = {},
    models = {},
    controllers = {
      find: function(name) {
        var controllerClass, controller, model;
        if (this[name]) {
          console.log('controller exists');
          return this[name];
        } else {
          console.log('creating controller instance: ' + name);
          controllerClass = controllerClasses[name];
          if (!controllerClass) {
            throw 'Controller is not defined or not loaded for ' + name;
          }
          model = models[name];
          if (!model) {
            throw 'Model is not defined or not loaded for ' + name;
          }
          controller = controllerClass(model);
          this[name] = controller;
          return controller;
        }
      }
    };

controllers.modelAssoc = function(name, model) {
  console.log('recieved model: ' + name);
  models[name] = model;
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
