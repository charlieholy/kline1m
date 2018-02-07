var channel = "ok_sub_spot_btc_usdt_kline_1min"

var len = channel.length;
console.log("len: " + len);

var lmin = channel.substr(len-4,len);
if("1min" == lmin)
console.log("1min: " + lmin)
