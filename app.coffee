
###
 * Module dependencies.
###

express = require('express')
everyauth = require('everyauth')
app = module.exports = express.createServer()
controllers = require('./controllers')
util = require('util')
conf = require('./' + (process.env.NODE_ENV || '') + '_conf.js')
logger = require('./logger')
i18n = require('./i18n.js')
users = []

logger 'env=' + process.env.NODE_ENV
logger 'MONGOHQ_URL=' + process.env.MONGOHQ_URL

require('./models').on('model-loaded', controllers.modelAssoc).load()
 
everyauth.twitter
  .consumerKey(conf.twitter.consumerKey)
  .consumerSecret(conf.twitter.consumerSecret)
  .findOrCreateUser( (session, accessToken, accessTokenSecret, twitterUserData) ->
    user = users[twitterUserData.id]
    if !user?
      user = {}
      user.twitter = twitterUserData
      users[twitterUserData.id] = user
    logger 'findOrCreateUser: ' + twitterUserData.id
    return user
  )
  .redirectPath '/list'

everyauth.everymodule.moduleErrback (err, data) ->
  console.log('auth err: ' + err)
  data.res.redirect 'error.jade', {title: 'One List To Rule Them All', message: err}

# Configuration

app.configure ->
  logger 'default config'
  app.set 'views', __dirname + '/views'
  app.set 'view engine', 'jade'
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.cookieParser()
  app.use express.session({ secret: 'NOdEknOckoUt2011' })

  app.use (req, res, next) ->
    lang = (req.session && req.session.lang) || 'en_US'
    res.local 'i18n', i18n[lang]
    next()

  app.use everyauth.middleware()
  app.use require('stylus').middleware({ src: __dirname + '/public/stylesheets/' })
  app.use app.router
  app.use express.static(__dirname + '/public')

app.configure 'development', ->
  logger 'dev mode'
  app.use express.errorHandler({ dumpExceptions: true, showStack: true })

app.configure 'production', ->
  logger 'prod mode'

# route middleware
mustBeLoggedIn = (req, res, next) ->
  if req.session.auth
    next()
  else
    res.redirect '/'

findController = (req, res, next) ->
  pattern = new RegExp "^/(.+?)(?:/.*)?$", "i"
  req.route.path.match(pattern)
  name = RegExp.$1
  req.controller = controllers.find name
  next()

# Routes

app.get '/', (req, res) -> res.render 'index', {}

app.get '/list', mustBeLoggedIn, findController, (req, res) ->
  req.controller.index req, res

app.post '/list/:command', mustBeLoggedIn, findController, (req, res) ->
  command = req.param 'command'
  logger 'command: ' + command
  req.controller[command](req, res)

app.get '/store/:command', mustBeLoggedIn, findController, (req, res)->
  command = req.param 'command'
  logger 'command: ' + command
  if req.controller[command]
    req.controller[command](req, res)
  else
    req.controller.get req, res

app.post '/store/:command', mustBeLoggedIn, findController, (req, res) ->
  command = req.param 'command'
  logger 'command: ' + command
  req.controller[command](req, res)

app.error (err, req, res) ->
  res.render('error.jade', {title: 'One List To Rule Them All', message: err})

everyauth.helpExpress app

port = process.env.PORT || 5000
app.listen port
console.log "Express server listening on port %d in %s mode", app.address().port, app.settings.env

