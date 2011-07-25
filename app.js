
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();
var shopping = require('./models/list.js');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'NOdEknOckoUt2011' }));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var products = [
  { name: 'eggs' },
  { name: 'ham' }
];

console.log('products: ' + products);
console.log('products: ' + shopping.list().products);

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'One List to Rule Them All',
    products: shopping.list().products
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
