var moment = require("moment");
var mm = Date.now()
console.log("mm: " + mm)

var formatDate = moment(mm).format('YYYY-MM-DD'); /*格式化时间*/
console.log("formatDate: " + formatDate)

var channel = "ok_sub_spot_eth_usdt_kline_1min";
channel = "ok_sub_spot_eth_usdt_ticker";
var redis = require("./redisutils")
//redis.rpush(channel + "_" + formatDate,mm)
redis.lrange(channel + "_" + formatDate,0,-1)