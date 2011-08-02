var util = require('util');

module.exports = function listController(list) {
  var that = {},
      emptyUser = { user: 'unknown', products: [] },
      title = 'One List to Rule Them All';
 
  var authorizedUser = function(req) {
    return req.session.auth.twitter.user.id;
  };
  
  var findUserList = function(req, res, onSuccess, onError) {
    list.findByUser(authorizedUser(req), function(err, userList) {
      if (err) {
        console.log('error retrieving user list: ' + err);
        onError(req, res, emptyUser);
      } else {
        onSuccess(req, res, userList);
      }
    });
  };

  var renderUserList = function(req, res, userList) {
    res.render('list', {
      title: title,
      list: userList
    });
  };

  that.index = function(req, res) {
    findUserList(req, res, renderUserList, renderUserList);
  };

  that.add = function(req, res) {
    var product = req.param('product'),
        onError = function(req, res) { res.redirect('/'); };
        onSuccess = function(req, res, userList) {
          console.log('add product: ' + product);
          userList.add(product);
          userList.save(function(err, userList) {
            if (err) {
              console.log('error adding product: ' + err);
            }
            console.log('product added, rendering list');
            renderUserList(req, res, userList);
          });
        };
    findUserList(req, res, onSuccess, onError);
  };

  return that;
};
