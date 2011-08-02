var fs = require('fs'),
    util = require('util'),
    mongoose = require('mongoose'),
    modelsPath = './models/',
    models = {};

fs.readdir(modelsPath, function(err, files) {
  var pattern = new RegExp("(.+).js$"), name, model;
  files.forEach(function(file) {
    if ('index.js' !== file && file.match(pattern)) {
      name = RegExp.$1;
      console.log('loading model: ' + RegExp.$1);
      model = require('./' + name)();
      models[name] = model;
      global[name + 'Model'] = mongoose.model(name, model.schema);
    }
  });
});

module.exports = models;
