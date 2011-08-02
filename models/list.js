var util = require('util'),
    mongoose = require('mongoose'),
    ProductSchema = new mongoose.Schema({
      name: {type: String}
    }),
    ListSchema = new mongoose.Schema({
      _id: mongoose.Schema.ObjectId,
      user: {type: String},
      products: [ProductSchema]
    });

module.exports = function list(data) {
  var that = data || {};
  
  that.findByUser = function(userId, callback) {
    listModel.findOne({user: userId}, function(err, listData) {
      var listObj;
      if (err) {
        listObj = list({user: 'unknown', products: []});
      } else {
        listObj = list(listData);
      }
      callback(err, listObj);
    });
  };
  
  that.add = function(product) {
    that.products.push(product);
  };
  
  that.remove = function(product) {
    that.products.pop(product);
  };

  that.schema = ListSchema;

  return that;
};
