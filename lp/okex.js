var ev = require("./bowevent")
var moment = require("moment")
var config = require("../config").config
var redis = require("../db/redis/redisutils")
var name = "okex"

var sub_1min = {
    'event': 'addChannel',
    'channel': 'ok_sub_spot_btc_usdt_kline_1min'
}

var sub_ticker = {
    'event': 'addChannel',
    'channel': 'ok_sub_spot_btc_usdt_ticker'
}

var markets = config.markets;
var btc = markets.btc
var usdt = markets.usdt


ev.evE.on("onopen"+name,function () {
    for (i in btc) {
        if (btc[i]) {
            console.log("btc i: " + i + " is true");
            sub_1min.channel = "ok_sub_spot_" + i + "_btc_kline_1min"
            var req = JSON.stringify(sub_1min);
            ev.evE.emit("sub"+name, req);

            sub_ticker.channel = "ok_sub_spot_" + i + "_btc_ticker"
            var req_tick = JSON.stringify(sub_ticker);
            ev.evE.emit("sub"+name, req_tick);

        }
    }
    for (i in usdt) {
        if (usdt[i]) {
            console.log("usdt i: " + i + " is true");
            sub_1min.channel = "ok_sub_spot_" + i + "_usdt_kline_1min"
            var req = JSON.stringify(sub_1min);
            ev.evE.emit("sub"+name, req);

            sub_ticker.channel = "ok_sub_spot_" + i + "_usdt_ticker"
            var req_tick = JSON.stringify(sub_ticker);
            ev.evE.emit("sub"+name, req_tick);
        }
    }
})

ev.evE.on("msg"+name,function (msg) {
    //console.log("msg: " + msg)
    try {
        var jdata = JSON.parse(msg);
    }
    catch (e) {
        console.log("e: " + e);
        return;
    }
    if (jdata[0]) {

        var indexdata = jdata[0];
        var channel = indexdata.channel;
        var len = channel.length;
        //ticker
        if("ticker" == channel.substr(len-6,len)){
            if (indexdata.data) {
                var tick = indexdata.data;
                // buy(double): 买一价
                // high(double): 最高价
                // last(double): 最新成交价
                // low(double): 最低价
                // sell(double): 卖一价
                // timestamp(long)：时间戳
                // vol(double): 成交量(最近的24小时)
                var kl = {}
                kl.buy = tick.buy
                kl.high = tick.high
                kl.last = tick.last
                kl.low = tick.low
                kl.sell = tick.sell
                kl.timestamp = tick.timestamp.toString()
                kl.vol = tick.vol
                var ts = tick.timestamp
                var key = name + "_" + channel + "_" + moment(Number(ts)).format('YYYY-MM-DD')
                var value = JSON.stringify(kl)
                //console.log("key: " + key);
                //console.log("value: " + value)
                redis.rpush(key, value);
            }
        }
        //1min
        else if("1min" == channel.substr(len-4),len){
            if (indexdata.data) {
                var data = indexdata.data;
                if (data.length > 0) {
                    //console.log("data: " + data[0]);
                    var tick = data[0];
                    //[时间,开盘价,最高价,最低价,收盘价,成交量]
                    if (tick.length < 5)
                        return;
                    var kl = {}
                    var ts = tick[0]
                    kl["ts"] = ts;
                    kl["amount"] = tick[5]
                    kl["open"] = tick[1]
                    kl["close"] = tick[4]
                    kl["low"] = tick[3]
                    kl["high"] = tick[2]
                    var key = name + "_" + channel + "_" + moment(Number(ts)).format('YYYY-MM-DD')
                    var value = JSON.stringify(kl)
                   // console.log("key: " + key);
                    //console.log("value: " + value)
                    redis.rpush(key, value);
                }
            }
        }

    }
})
