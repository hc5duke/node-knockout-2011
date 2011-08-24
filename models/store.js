var util = require('util');

module.exports = function list(data) {
  var that = data || {};
 
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
