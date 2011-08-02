var controller = require('../controllers/list.js'),
    myController, mockList, mockReq, mockRes,
    emptyFunc = function(){},
    dummyData = {name: 'test', products: [], add: emptyFunc, save: emptyFunc},
    dummyResData = { 
      title: 'One List to Rule Them All',
      list: dummyData};

beforeEach(function() {
  mockReq = {param: emptyFunc};
  spyOn(mockReq, 'param').andReturn({name: 'myproduct'});
  mockRes = {render: emptyFunc};
  spyOn(mockRes, 'render').andCallFake(emptyFunc);
  mockList = jasmine.createSpy('mockList');
  mockList.findByUser = function(user, callback) {
    callback(false, dummyData);
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
    spyOn(dummyData, 'save').andCallFake(function(callback) {
      callback(false, dummyData);
    });
    myController.add(mockReq, mockRes);
    expect(mockRes.render).toHaveBeenCalledWith('list',dummyResData);
  });
});
