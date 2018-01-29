var log4js = require('log4js');
log4js.configure({
    appenders: {
        stdout: {//控制台输出
            type: 'stdout'
        },
        cheese: { type: 'file', filename: 'cheese.log' },
        crash: {//错误日志
            type: 'dateFile',
            filename: 'crash',
            pattern: '-yyyy-MM-dd-hh-mm-ss.log',
            alwaysIncludePattern: true
        },},
    categories: { default: { appenders: ['cheese'], level: 'debug' },
        crash: { appenders: ['crash'], level: 'debug' }},
    pm2: true
})
var Logger = log4js.getLogger('cheese');
var LoggerCrash = log4js.getLogger('crash');

function debug(msg){
    Logger.debug(msg)
}

function debugCrash(msg){
    LoggerCrash.debug(msg)
}

exports.debug = debug
exports.debugCrash = debugCrash