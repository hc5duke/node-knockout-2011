
/**
 * Module dependencies.
 */

var express = require('express'),
    everyauth = require('everyauth'),
    app = module.exports = express.createServer(),
    shopping = require('./models/list.js'),
    util = require('util'),
    Promise = everyauth.Promise,
    user = {};

everyauth.twitter
  .consumerKey('kB8BUepK9tf9FV81TQPyg')
  .consumerSecret('BpKHQAJMUEGBqko9wRy7EPPpmA74CICOtKX6B2Ve8')
  .findOrCreateUser(function(session, accessToken, accessTokenSecret, twitterUserData) {
    user.twitter = twitterUserData;
    console.log('findOrCreateUser: ' + twitterUserData.id);
    return user;
  })
  .redirectPath('/');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'NOdEknOckoUt2011' }));
  app.use(everyauth.middleware());
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

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'One List to Rule Them All',
    products: shopping.list().products
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
