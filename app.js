
/**
 * Module dependencies.
 */

var express = require('express'),
    everyauth = require('everyauth'),
    app = module.exports = express.createServer(),
    list = require('./models/list.js'),
    util = require('util'),
    conf = require('./' + (process.env.NODE_ENV || '') + '_conf.js'),
    users = [];

console.log('env=' + process.env.NODE_ENV);

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
  .redirectPath('/');

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

// Routes

app.get('/', function(req, res){
  var userId = req.session.auth ? req.session.auth.twitter.user.id : '';
  list.findByUser(userId, function(err, userList) {
    if (err) {
      console.log('error finding list: ' + err);
    } else {
      console.log('found list for user: ' + util.inspect(userList));
    } 
    res.render('index', {
      title: 'One List to Rule Them All',
      list: userList
    });
  });
});


everyauth.helpExpress(app);

var port = process.env.PORT || 5000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
