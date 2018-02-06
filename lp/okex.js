var ev = require("./bowevent")

var req_orderinfo = {
    'event': 'addChannel',
    'channel': 'ok_sub_spot_btc_usdt_kline_1min',
}
var d = {}
d.lp = "okex"
d.req = JSON.stringify(req_orderinfo)