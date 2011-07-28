exports.list = function() {
  var that = {},
      productsByUser = [];
  
  that.productsFor = function(userId) {
    return productsByUser[userId] || [];
  };
  
  productsByUser['80038574'] = [
    { name: 'eggs' },
    { name: 'ham' }
  ];

  productsByUser['344272451'] = [
    { name: 'bread' },
    { name: 'cheese' }
  ];

  return that;
};
