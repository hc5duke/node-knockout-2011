
var conf = require('./' + (process.env.NODE_ENV || '') + '_conf.js'),
    loggerClient = require('loggly').createClient({ subdomain: 'weswilliamz' });

module.exports = function(msg) {
  loggerClient.log(conf.loggly.key, msg, function(err, result) {
    if (err) {
      console.log('loglly err: ' + err + '; result: ' + result);
    }
  });
};

