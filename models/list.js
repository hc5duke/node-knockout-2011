var util = require('util');

module.exports = function list(data) {
  var that = data || {};

  that.findByUser = function(userId, callback) {
    that.findOne({user: userId}, function(err, listData) {
      var listObj;
      if (err || !listData) {
        console.log('error finding list or no list yet: ' + err);
        listData = that.newModel();
        listData.user = userId;
      }
      listObj = that.newInstance(listData);
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

  return that;
};
