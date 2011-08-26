var controller = require('../controllers/list.js'),
    myController, mockList, mockReq, mockRes,
    emptyFunc = function(){},
    dummyList = {name: 'test', products: [], 
      add: emptyFunc, remove: emptyFunc, save: emptyFunc
    },
    dummyResData = {list: dummyList},
    failSave = function(callback) { callback('error', dummyList); },
    successSave = function(callback) { callback(false, dummyList); },
    spySave = function(save) { spyOn(dummyList, 'save').andCallFake(save); };
    findByUser = function(err) {
      return function(user, callback) {
        callback(err, dummyList);
      };
    };

beforeEach(function() {
  mockReq = {param: emptyFunc};
  spyOn(mockReq, 'param').andReturn({name: 'myproduct'});

  mockRes = {render: emptyFunc, redirect: emptyFunc, partial: emptyFunc, send: emptyFunc};
  spyOn(mockRes, 'render').andCallFake(emptyFunc);
  spyOn(mockRes, 'redirect').andCallFake(emptyFunc);
  spyOn(mockRes, 'send').andCallFake(emptyFunc);

  mockList = jasmine.createSpy('mockList');
  mockList.findByUser = findByUser(false);

  myController = controller(mockList);
  myController.authorizedUser = function() {return '123';};
});

describe('list controller', function() {
  describe('index', function() {
    it('the index method should render the list', function() {
      myController.index(mockReq, mockRes);
      expect(mockRes.render).toHaveBeenCalledWith('list',dummyResData);
    });
  });

  describe('add product', function() {
    it('should render the list on successfully adding a product', function() {
      spySave(successSave);
      myController.add(mockReq, mockRes);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should redirect to root on error adding a product', function() {
      spySave(failSave);
      myController.add(mockReq, mockRes);
      expect(mockRes.redirect).toHaveBeenCalledWith('/list');
    });

    it('should redirect to the list on error finding the list after add', function() {
      mockList.findByUser = findByUser(true);
      spySave(failSave);
      myController.add(mockReq, mockRes);
      expect(mockRes.redirect).toHaveBeenCalledWith('/list');
    });
  });

  describe('remove product', function() {
    it('should render the list on successfully removing a product', function() {
      spySave(successSave);
      myController.remove(mockReq, mockRes);
      expect(mockRes.send).toHaveBeenCalled();
    });
  });

});
