conf = require './' + (process.env.NODE_ENV || '') + '_conf.js'
loggerClient = require('loggly').createClient({ subdomain: 'weswilliamz' })

module.exports = (msg) ->
  loggerClient.log conf.loggly.key, msg, (err, result) ->
    console.log('loglly err: ' + err + '; result: ' + result) if err
