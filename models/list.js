var util = require('util');

module.exports = function list(data) {
  var that = data || {};

  that.findByUser = function(userId, callback) {
    ListModel.findOne({user: userId}, function(err, listData) {
      var listObj;
      if (err || !listData) {
        console.log('error finding list or no list yet: ' + err);
        listData = new ListModel();
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

  return that;
};
