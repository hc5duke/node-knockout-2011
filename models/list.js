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
    //var listModel = mongoose.model('list', ListSchema);

module.exports = function list(data) {
  var that = data || {};
  
  that.findByUser = function(userId, callback) {
    console.log('finding user: ' + userId);
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
    console.log('adding product: ' + util.inspect(product));
    that.products.push(product);
  };

  that.schema = ListSchema;

  return that;
};
