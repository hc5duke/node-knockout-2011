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
      if (err || !listData) {
        console.log('error finding list or no list yet: ' + err);
        listData = that.model();
        listData.user = userId;
      }
      listObj = list(listData);
      callback(err, listObj);
    });
  };
  
  that.add = function(product) {
    if (!that.products) {
      that.products = [];
    }
    that.products.push(product);
  };
  
  that.remove = function(product) {
    that.products.id(product.id).remove();
  };

  that.schema = ListSchema;

  that.model = function() {
    return new listModel();
  };

  return that;
};
