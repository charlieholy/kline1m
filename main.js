require("./ltc_kline1m")
require("./eth_kline1m")
require("./ticker")
require("./lp/huopro/huopro_btc_kline1m")
require("./lp/okex/okex_btc_kline1m")
require("./lp/binance/binance_btc_kline1m")
require("./lp/bitfinex/bitfinex_btc_kline1m")
require("./httpserver/SimpleServer")
let logger = require("./log4js/Loger")


process.on('uncaughtException', function (err) {
    //打印出错误
    console.log(err);
    //打印出错误的调用栈方便调试
    console.log(err.stack)

    logger.debugCrash(err)
    logger.debugCrash(err.stack)

});