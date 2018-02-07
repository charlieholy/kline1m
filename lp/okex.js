var ev = require("./bowevent")
var config = require("../config").config
var name = "okex"

var sub_1min = {
        'event': 'addChannel',
        'channel': 'ok_sub_spot_btc_usdt_kline_1min'
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

        }
    }
    for (i in usdt) {
        if (usdt[i]) {
            console.log("usdt i: " + i + " is true");
            sub_1min.channel = "ok_sub_spot_" + i + "_usdt_kline_1min"
            var req = JSON.stringify(sub_1min);
            ev.evE.emit("sub"+name, req);
        }
    }
})

ev.evE.on("msg"+name,function (msg) {
    console.log("msg: " + msg)
    try {
        var jdata = JSON.parse(msg);
    }
    catch (e) {
        console.log("e: " + e);
        return;
    }
    if (jdata[0]) {
        var indexdata = jdata[0];
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
                var key = lp + symbol + ts
                var value = kl
                LevelDb.put(key, JSON.stringify(kl), function (err) {
                    if (err) {
                        console.log("okex leveldb err: " + err);
                    }
                });
            }
        }
    }
})
