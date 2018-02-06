var conws = require("./wstmplete")
var clps = require("../config")
var ev = require("./bowevent")


var lps = clps.lps
for(v in lps){
    var cws = new conws(lps[v])
    cws.run()
}

var req_orderinfo = {
    'event': 'addChannel',
    'channel': 'ok_sub_spot_btc_usdt_kline_1min',
}
var d = {}
d.lp = "okex"
d.req = JSON.stringify(req_orderinfo)
ev.evE.emit("sub",d);
ev.evE.on("msg",function (dd) {
    var lp = dd.lp
    if("okex" == lp){
        console.log("okex: " + dd.msg)
    }

})
function sub() {
    ev.evE.emit("sub",d);
}
var reconnectInterval = 5000
setTimeout(sub, reconnectInterval);


