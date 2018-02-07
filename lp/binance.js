var ev = require("./bowevent")
var moment = require("moment")
var config = require("../config").config
var redis = require("../db/redis/redisutils")
var name = "binance"

var kline1m = "wss://stream.binance.com:9443/ws/btcusdt@kline_1m"
var conws = require("./wstmplete")
var lp = {
    name: "binance",
    url: kline1m
}

var markets = config.markets;
var btc = markets.btc
var usdt = markets.usdt
for (i in btc) {
    if (btc[i]) {
        console.log("btc i: " + i + " is true");
        lp.url = "wss://stream.binance.com:9443/ws/" + i + "btc@kline_1m";
        var cws = new conws(lp);
        cws.run()
        lp.url = "wss://stream.binance.com:9443/ws/" + i + "btc@ticker";
        var cws = new conws(lp);
        cws.run()
    }
}
for (i in usdt) {
    if (usdt[i]) {
        console.log("usdt i: " + i + " is true");
        lp.url = "wss://stream.binance.com:9443/ws/" + i + "usdt@kline_1m";
        var cws = new conws(lp);
        cws.run()
        lp.url = "wss://stream.binance.com:9443/ws/" + i + "usdt@ticker";
        var cws = new conws(lp);
        cws.run()
    }
}


ev.evE.on("msg" + name, function (msg) {
    var jdata = msg.data;
    var url = msg.url
    //console.log("msg: " + data)
    try {
        var data = JSON.parse(jdata);
    }
    catch (e) {
        console.log("e: " + e);
        return;
    }
    //kline_1m
    var len = msg.url.length;
    if ("kline_1m" == url.substr(len - 8, len)) {
        var ts = data.E
        var k = data.k
        if (k) {
            var kl = {}
            kl["ts"] = ts.toString();
            kl["amount"] = k.v
            kl["open"] = k.o
            kl["close"] = k.c
            kl["low"] = k.l
            kl["high"] = k.h
            var key = name + "_" + url + "_" + moment(Number(ts)).format('YYYY-MM-DD')
            var value = JSON.stringify(kl)
            redis.rpush(key, value);
        }
    }
    //ticker
    else if("ticker" == url.substr(len-6,len)){
        var kl = {}
        kl.buy = data.b
        kl.high = data.h
        kl.low = data.l
        kl.sell = data.a
        kl.timestamp = data.E.toString()
        kl.vol = data.v
        var ts = kl.timestamp
        var key = name + "_" + url + "_" + moment(Number(ts)).format('YYYY-MM-DD')
        var value = JSON.stringify(kl)
        redis.rpush(key, value);
    }
})
