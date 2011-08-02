
var fs = require('fs'),
    util = require('util'),
    controllersPath = './controllers',
    controllers = {};

fs.readdir(controllersPath, function(err, files) {
  var pattern = new RegExp("(.+).js$"), name, model;
  files.forEach(function(file) {
    if ('index.js' !== file && file.match(pattern)) {
      name = RegExp.$1;
      console.log('loading controller: ' + name);
      controller = require('./' + name);
      controllers[name] = controller;
    }
  });
});

module.exports = controllers;
