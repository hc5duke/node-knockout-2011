var controller = require('../controllers/list.js'),
    myController, mockList, mockReq, mockRes,
    emptyFunc = function(){},
    dummyList = {name: 'test', products: [], add: emptyFunc, save: emptyFunc},
    dummyResData = { 
      title: 'One List to Rule Them All',
      list: dummyList},
    failSave = function(callback) {
      callback('error', dummyList);
    },
    successSave = function(callback) { callback(false, dummyList); };

var spySave = function(save) {
  spyOn(dummyList, 'save').andCallFake(save);
};

beforeEach(function() {
  mockReq = {param: emptyFunc};
  spyOn(mockReq, 'param').andReturn({name: 'myproduct'});

  mockRes = {render: emptyFunc, redirect: emptyFunc};
  spyOn(mockRes, 'render').andCallFake(emptyFunc);
  spyOn(mockRes, 'redirect').andCallFake(emptyFunc);

  mockList = jasmine.createSpy('mockList');
  mockList.findByUser = function(user, callback) {
    callback(false, dummyList);
  };

  myController = controller(mockList);
  myController.authorizedUser = function() {return '123';};
});

describe('list controller', function() {
  it('the index method should render the list', function() {
    myController.index(mockReq, mockRes);
    expect(mockRes.render).toHaveBeenCalledWith('list',dummyResData);
  });

  it('should render the list on successfully adding a product', function() {
    spySave(successSave);
    myController.add(mockReq, mockRes);
    expect(mockRes.render).toHaveBeenCalledWith('list',dummyResData);
  });

  it('should redirect to root on error adding a product', function() {
    spyOn(dummyList, 'save').andCallFake(failSave);
    myController.add(mockReq, mockRes);
    expect(mockRes.redirect).toHaveBeenCalledWith('/list');
  });

  it('should redirect to the list on error finding the list after add', function() {
    mockList.findByUser = function(user, callback) {
      callback(true, dummyList);
    };
    spyOn(dummyList, 'save').andCallFake(failSave);
    myController.add(mockReq, mockRes);
    expect(mockRes.redirect).toHaveBeenCalledWith('/list');
  });
});
