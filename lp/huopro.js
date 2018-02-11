var ev = require("./bowevent")
var moment = require("moment")
var config = require("../config").config
var redis = require("../db/redis/redisutils")
let pako = require('pako');
var name = "huopro"

var sub_1min = {
    'sub': 'market.btcusdt.kline.1min',
}
var markets = config.markets;
var btc = markets.btc
var usdt = markets.usdt

ev.evE.on("onopen"+name,function () {
    for (i in btc) {
        if (btc[i]) {
            //console.log("btc i: " + i + " is true");
            sub_1min.sub = "market."+ i +"btc.kline.1min"
            var req = JSON.stringify(sub_1min);
            ev.evE.emit("sub"+name, req);
        }
    }
    for (i in usdt) {
        if (usdt[i]) {
            //console.log("usdt i: " + i + " is true");
            sub_1min.sub = "market."+ i +"usdt.kline.1min"
            var req = JSON.stringify(sub_1min);
            ev.evE.emit("sub"+name, req);
        }
    }
})

ev.evE.on("msg"+name,function (msg) {
    let jmsg = pako.inflate(new Uint8Array(msg), {to: 'string'});
    //console.log("msg: " + jmsg)
    try {
        var data = JSON.parse(jmsg);
    }
    catch (e) {
        console.log("e: " + e);
        return;
    }
    var ts = data.ts;
    var ch = data.ch
    var tick = data.tick;
    // "amount": 成交量,
    //     "count": 成交笔数,
    //     "open": 开盘价,
    //     "close": 收盘价,当K线为最晚的一根时，是最新成交价
    // "low": 最低价,
    //     "high": 最高价,
    //     "vol": 成交额, 即 sum(每一笔成交价 * 该笔的成交量)
    if (tick) {
        var kl = {}
        kl["ts"] = ts.toString();
        kl["amount"] = tick.amount.toString()
        kl["open"] = tick.open.toString()
        kl["close"] = tick.close.toString()
        kl["low"] = tick.low.toString()
        kl["high"] = tick.high.toString()
        var key = name+"_"+ch + "_" + moment(Number(ts)).format('YYYY-MM-DD')
        var value = JSON.stringify(kl)
        ev.evE.emit("pushdb",key,value)
    }

})
