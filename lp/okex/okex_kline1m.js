

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
var okCoinWebSocket = {}
okCoinWebSocket["overtime"] = 8000;
function checkConnect() {
    socket.send("{'event':'ping'}");
    if ((new Date().getTime() - okCoinWebSocket.lastHeartBeat) > okCoinWebSocket.overtime) {
        onsole.log("socket 连接断开，正在尝试重新建立连接");
        //testWebSocket();
    }
}





socket.onopen = function (event) {
    console.log('WebSocket connect at time: ' + new Date());
    socket.send(substr);
    setInterval(checkConnect,5000);
};

socket.onmessage = function (event) {
    let raw_data = event.data;
    // console.log(raw_data);
    // sub [{}]
    raw_data = "asd";
    try {
        var jdata = JSON.parse(raw_data);
    }
    catch (e)
    {
        console.log("e: " + e );
        return;
    }
    if (jdata.event == 'pong') {
        okCoinWebSocket.lastHeartBeat = new Date().getTime();
        return
    }
    console.log(raw_data);
};

socket.onclose = function(event) {
    console.log('WebSocket close at time: ' + new Date());
};