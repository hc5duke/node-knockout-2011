var fs = require('fs'),
    util = require('util'),
    mongoose = require('mongoose'),
    modelsPath = './models/',
    models = {};

var capitaliseFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

fs.readdir(modelsPath, function(err, files) {
  var pattern = new RegExp("^(((?!Schema|index).)+)\\.js$"), name, model, ormModel;
  files.forEach(function(file) {
    if (file.match(pattern)) {
      name = RegExp.$1;
      console.log('loading model: ' + name);
      model = require('./' + name);
      modelSchema = require('./' + name + 'Schema');
      ormModel = mongoose.model(name, modelSchema);
      modelInst = model();
      global[capitaliseFirstLetter(name) + 'Model'] = ormModel;
      models[name] = modelInst;
    }
  });
});

module.exports = models;
