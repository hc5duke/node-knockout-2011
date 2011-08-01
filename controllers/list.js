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

  that.index = function(req, res) {
    var render = function(req, res, userList) {
      res.render('list', {
        title: title,
        list: userList
      });
    };
    findUserList(req, res, render, render);
  };

  return that;
};

