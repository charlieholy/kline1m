

//var login = {'event':'login','parameters':{}}
//var sub_balance =  {'event':'addChannel','channel':'ok_sub_spot_btc_usdt_balance',}//ok_sub_spot_X_balance
var url = "wss://real.okex.com:10441/websocket"

var req_orderinfo = {
    'event':'addChannel',
    'channel':'ok_sub_spot_btc_usdt_kline_1min',
}

//44612603
//1002	交易金额大于余额
//1003	交易金额小于最小交易值
//10007	签名不匹配

var sub = req_orderinfo
// see readme
var substr = JSON.stringify(sub);
console.log("substr: " + substr);

let WebSocket = require('ws');

const socket = new WebSocket(url); //如果symbol = 'btccny'或者'ltccny' 请使用wss://api.huobi.com/ws


socket.onopen = function (event) {
    console.log('WebSocket connect at time: ' + new Date());
    socket.send("ping");
    socket.send(substr);
};

socket.onmessage = function (event) {
    let raw_data = event.data;
    // console.log(raw_data);
    // sub [{}]
    if(raw_data == "pong")

        return
    var subdata = raw_data.substr(1,raw_data.length-2)
    console.log(subdata);
};

socket.onclose = function(event) {
    console.log('WebSocket close at time: ' + new Date());
};