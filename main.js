let logger = require("./log4js/Loger")
require("./lp/goconfig")


process.on('uncaughtException', function (err) {
    //打印出错误
    console.log(err);
    //打印出错误的调用栈方便调试
    console.log(err.stack)

    logger.debugCrash(err)
    logger.debugCrash(err.stack)

});