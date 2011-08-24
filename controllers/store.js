var util = require('util');

module.exports = function listController(store) {
  var that = {};
 
  var findStoreById = function(req, res, onSuccess, onError) {
    var storeData = req.param('store');
    store.findById(storeData.id, function(err, store) {
      if (err) {
        console.log('error saving store: ' + err);
      }
      store.name = storeData.name;
      store.postal_code = storeData.postal_code;
      onSuccess(req, res, store);
    });
  };

  var storeAction = function(req, res) {
    var storeInfo = req.param('store'),
        onError = function(req, res) { res.redirect('/edit_store'); };
        onSuccess = function(req, res, store) {
          store.save(function(err, savedStore) {
            if (err) {
              console.log('error ' + action + 'ing product: ' + err);
            }
            res.render('edit_store', {
              title: '',
              store: savedStore
            });
          });
        };
    findStoreById(req, res, onSuccess, onError);
  };


  that.create = function(req, res) {
    res.render('edit_store', { 
      title: '',
      store: {_id: null, name: null, postal_code: null, products: []} 
     });
  };

  that.update = function(req, res) {
    storeAction(req, res);
  };

  that.remove = function(req, res) {
  };

  return that;
};
