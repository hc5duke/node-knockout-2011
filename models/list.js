var util = require('util'),
    mongoose = require('mongoose'),
    ProductSchema = new mongoose.Schema({
      name: {type: String}
    }),
    ListSchema = new mongoose.Schema({
      _id: mongoose.Schema.ObjectId,
      user: {type: String},
      products: [ProductSchema]
    }),
    listModel = mongoose.model('list', ListSchema);

module.exports = function list() {
  var that = {};
  
  that.findByUser = function(userId, callback) {
//    console.log('finding list for ' + userId);
    listModel.findOne({user: userId}, callback);
  };
  
  return that;
}();
