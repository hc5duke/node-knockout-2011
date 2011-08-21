
/**
 * Module dependencies.
 */

var express = require('express'),
    everyauth = require('everyauth'),
    app = module.exports = express.createServer(),
    controllers = require('./controllers'),
    util = require('util'),
    conf = require('./' + (process.env.NODE_ENV || '') + '_conf.js'),
    // loggerClient = require('loggly').createClient({ subdomain: 'weswilliamz' }),
    logger = require('./logger.js'),
    users = [];

require('./models').on('model-loaded', controllers.modelAssoc).load();

// function logger(msg) {
//   loggerClient.log(conf.loggly.key, msg, function(err, result) {
//     if (err) {
//       console.log('loglly err: ' + err + '; result: ' + result);
//     }
//   });
// }

logger('env=' + process.env.NODE_ENV);
logger('MONGOHQ_URL=' + process.env.MONGOHQ_URL);

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
    logger('findOrCreateUser: ' + twitterUserData.id);
    return user;
  })
  .redirectPath('/list');

everyauth.everymodule.moduleErrback( function (err) {
  data.res.redirect('error.jade', {title: 'One List To Rule Them All', message: err}); 
});


// Configuration

app.configure(function(){
  logger('default config');
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
  logger('dev mode');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  logger('prod mode');
});

// route middleware
var mustBeLoggedIn = function(req, res, next) {
  req.session.auth ? next() : res.redirect('/');
};

var findController = function(req, res, next) {
  var pattern = new RegExp("^/(.+?)(?:/.*)?$", "i"), name;
  req.route.path.match(pattern);  
  name = RegExp.$1;
  req.controller = controllers.find(name);
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
  logger('command: ' + command);
  req.controller[command](req, res);
});

app.error(function(err, req, res) {
  res.render('error.jade', {title: 'One List To Rule Them All', message: err});
});

everyauth.helpExpress(app);

var port = process.env.PORT || 5000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

