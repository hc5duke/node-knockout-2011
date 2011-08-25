var util = require('util');

module.exports = function listController(list) {
  var that = {},
      title = 'One List to Rule Them All';
 
  that.authorizedUser = function(req) {
    return req.session.auth.twitter.user.id;
  };
  
  var findUserList = function(req, res, onSuccess, onError) {
    list.findByUser(that.authorizedUser(req), function(err, userList) {
      if (userList.user === undefined) {
        console.log('new user list adding user');
        userList.user = that.authorizedUser(req);
      }
      onSuccess(req, res, userList);
    });
  };

  var renderUserList = function(req, res, userList) {
    res.render('list', {
      title: title,
      list: userList
    });
  };

  var removeProduct = function(req, res, userList, product) {
    res.send(JSON.stringify(product));
  };

  var addProduct = function(req, res, userList) {
    var products = userList.products;
    res.send(JSON.stringify(products[products.length - 1]));
  };

  var productAction = function(req, res, action, callback) {
    var product = req.param('product'),
        onError = function(req, res) { res.redirect('/list'); };
        onSuccess = function(req, res, userList) {
          userList[action](product);
          userList.save(function(err) {
            if (err) {
              console.log('error ' + action + 'ing product: ' + err);
              res.redirect('/list');
            } else {
              console.log('product action for: ' + JSON.stringify(product));
              console.log('product action for: ' + JSON.stringify(userList));
              callback(req, res, userList, product);
            }
          });
        };
    findUserList(req, res, onSuccess, onError);
  };

  that.index = function(req, res) {
    findUserList(req, res, renderUserList, renderUserList);
  };

  that.add = function(req, res) {
    productAction(req, res, 'add', addProduct);
  };

  that.remove = function(req, res) {
    productAction(req, res, 'remove', removeProduct);
  };

  return that;
};
