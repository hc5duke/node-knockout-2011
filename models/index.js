var fs = require('fs'),
    util = require('util'),
    mongoose = require('mongoose'),
    modelsPath = './models/',
    models = {};

fs.readdir(modelsPath, function(err, files) {
  var pattern = new RegExp("(.+).js$"), name, model, ormModel;
  files.forEach(function(file) {
    if ('index.js' !== file && file.match(pattern)) {
      name = RegExp.$1;
      console.log('loading model: ' + name);
      model = require('./' + name);
      modelInst = model();
      ormModel = mongoose.model(name, modelInst.schema);
      global[name + 'Model'] = ormModel;
      models[name] = modelInst;
    }
  });
});

module.exports = models;
