var log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'debug' } }
})
var Logger = log4js.getLogger('cheese');

function debug(msg){
    Logger.debug(msg)
}

exports.debug = debug