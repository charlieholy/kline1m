var ev = require("./bowevent")
var moment = require("moment")
var config = require("../config").config
var redis = require("../db/redis/redisutils")
var name = "bitfinex"

var sub_1min = {
    event: "subscribe",
    channel: "candles",
    key: "trade:1m:tBTCUSD"
}

var sub_ticker = {
    event:"subscribe",
    channel:"ticker",
    pair:"BTCUSD"
}

var markets = config.markets;
var btc = markets.btc
var usdt = markets.usdt


ev.evE.on("onopen"+name,function () {
    for (i in btc) {
        if (btc[i]) {
            console.log("btc i: " + i + " is true");
            sub_1min.key = "trade:1m:t" + i.toUpperCase() + "BTC";
            console.log("key: " + sub_1min.key)
            var req = JSON.stringify(sub_1min);
            ev.evE.emit("sub"+name, req);

            sub_ticker.pair = i.toUpperCase() + "BTC";
            var req_tick = JSON.stringify(sub_ticker);
            ev.evE.emit("sub"+name, req_tick);

        }
    }
    for (i in usdt) {
        if (usdt[i]) {
            console.log("usdt i: " + i + " is true");
            sub_1min.key = "trade:1m:t" + i.toUpperCase() + "USD";
            var req = JSON.stringify(sub_1min);
            ev.evE.emit("sub"+name, req);

            sub_ticker.pair = i.toUpperCase() + "USD";
            var req_tick = JSON.stringify(sub_ticker);
            ev.evE.emit("sub"+name, req_tick);
        }
    }
})

var tickerchannel = []


var kline1mchannel = []

ev.evE.on("msg"+name,function (msg) {
    //console.log("msg: " + msg)
    try {
        var data = JSON.parse(msg);
    }
    catch (e) {
        console.log("e: " + e);
        return;
    }

    if(data.channel){
        var ch = data.channel;
        if("candles" == ch){  //kline1m
            var chanId = data.chanId;
            var uurl = data.key;
            kline1mchannel[chanId] = uurl
        }
        else if("ticker" == ch){
            var chanId = data.chanId;
            var pair = data.pair;
            var uurl = "ticker_" + pair;
            tickerchannel[chanId] = uurl;
        }
    }

    if (data.length > 1) {

        if (data[1][0].length > 1) {
            return
        }
        var chid = data[0];
        if(tickerchannel[chid]){
            var tick = data[1];
            if (tick.length > 4) {
                var kl = {}
                kl.buy = tick[0]
                kl.high = tick[8]
                kl.last = tick[6]
                kl.low = tick[9]
                kl.sell = tick[2]
                kl.timestamp = new Date().getTime()
                kl.vol = tick[7]
                var ts = kl.timestamp
                var key = name + "_" + tickerchannel[chid] + "_" + moment(Number(ts)).format('YYYY-MM-DD')
                kl.key = key
                var value = JSON.stringify(kl)
                redis.rpush(key,value)
            }
        }
        else if(kline1mchannel[chid]){
           // console.log("msg: " + msg);
            var tick = data[1];
            if (tick.length > 4) {
                var kl = {}
                var ts = tick[0].toString()
                kl["ts"] = tick[0];
                kl["amount"] = tick[5]
                kl["open"] = tick[1]
                kl["close"] = tick[2]
                kl["low"] = tick[4]
                kl["high"] = tick[3]
                var key = name + "_" + kline1mchannel[chid] + "_" + moment(Number(ts)).format('YYYY-MM-DD')
                var value = JSON.stringify(kl)
                redis.rpush(key,value)
            }
        }

    }
})
