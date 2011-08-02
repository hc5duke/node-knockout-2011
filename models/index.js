var fs = require('fs'),
    util = require('util'),
    modelsPath = './models/',
    models = {};

//var models = require('./list');

fs.readdir(modelsPath, function(err, files) {
  var pattern = new RegExp("(.+).js$");
  files.forEach(function(file) {
    if ('index.js' !== file && file.match(pattern)) {
      console.log('loading model: ' + RegExp.$1);
      models[RegExp.$1] = require('./'+RegExp.$1)();
    }
  });
  console.log(util.inspect(models));
});

module.exports = models;
