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
            var d = {}
            d.lp = "okex"
            d.req = JSON.stringify(sub_1min);
            ev.evE.emit("sub"+name, d);

        }
    }
    for (i in usdt) {
        if (usdt[i]) {
            console.log("usdt i: " + i + " is true");
            sub_1min.channel = "ok_sub_spot_" + i + "_usdt_kline_1min"
            var d = {}
            d.lp = "okex"
            d.req = JSON.stringify(sub_1min);
            ev.evE.emit("sub"+name, d);
        }
    }
})

ev.evE.on("msg"+name,function (msg) {
    console.log("msg: " + msg)
})
