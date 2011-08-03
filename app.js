
/**
 * Module dependencies.
 */

var express = require('express'),
    everyauth = require('everyauth'),
    app = module.exports = express.createServer(),
    models = require('./models'),
    controllers = require('./controllers'),
    util = require('util'),
    conf = require('./' + (process.env.NODE_ENV || '') + '_conf.js'),
    users = [],
    mongoose = require('mongoose'),
    db = mongoose.connect(process.env.MONGOHQ_URL, function (err) { 
      if (err) {
        console.log('connection err: ' + err); 
      } else {
        console.log('connected to db');
      }
    });

console.log('env=' + process.env.NODE_ENV);
console.log('MONGOHQ_URL=' + process.env.MONGOHQ_URL);

everyauth.twitter
  .consumerKey(conf.twitter.consumerKey)
  .consumerSecret(conf.twitter.consumerSecret)
  .findOrCreateUser(function(session, accessToken, accessTokenSecret, twitterUserData) {
    var user = users[twitterUserData.id];
    if (!user) {
      user = {};
      user.twitter = twitterUserData;
      users[twitterUserData.id] = user;
    }
    console.log('findOrCreateUser: ' + twitterUserData.id);
    return user;
  })
  .redirectPath('/list');

// Configuration

app.configure(function(){
  console.log('default config');
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

app.configure('development', function() {
  console.log('dev mode');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  console.log('prod mode');
  app.use(express.errorHandler()); 
});

// route middleware
var mustBeLoggedIn = function(req, res, next) {
  req.session.auth ? next() : res.redirect('/');
};

var findController = function(req, res, next) {
  var pattern = new RegExp("^/(.+?)(?:/.*)?$", "i"), name;
  req.route.path.match(pattern);  
  name = RegExp.$1;
  req.controller = controllers[name](models[name]);
  next();
};

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'One List to Rule Them All'
  });
});

app.get('/list', mustBeLoggedIn, findController, function(req, res) {
  req.controller.index(req, res);
});

app.post('/list/:command', mustBeLoggedIn, findController, function(req, res) {
  var command = req.param('command');
  console.log('command: ' + command);
  req.controller[command](req, res);
});

everyauth.helpExpress(app);

var port = process.env.PORT || 5000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
