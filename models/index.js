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

fs.readdir(modelsPath, function(err, files) {
  var pattern = new RegExp("^(((?!Schema|index).)+)\\.js$"), name, model, modelSchema, ormModel;
  files.forEach(function(file) {
    if (file.match(pattern)) {
      name = RegExp.$1;
      console.log('loading model: ' + name);
      model = require('./' + name);
      modelSchema = require('./' + name + 'Schema');
      ormModel = mongoose.model(name, modelSchema);
      global[capitaliseFirstLetter(name) + 'Model'] = ormModel;
      module.exports[capitaliseFirstLetter(name) + 'Model'] = ormModel;
      models[name] = model();
      eventEmitter.emit('model-loaded', name, models[name]);
    }
  });
});

module.exports = models;
