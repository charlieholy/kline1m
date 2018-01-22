var url = "ws://localhost:8081"

var req_orderinfo = {
    'event':'addChannel',
    'channel':'ok_sub_spot_btc_usdt_kline_1min',
}

var sub = req_orderinfo
// see readme
var substr = JSON.stringify(sub);
console.log("substr: " + substr);

let WebSocket = require('ws');
let lp = "okex"

const socket = new WebSocket(url);
var okCoinWebSocket = {}
okCoinWebSocket["overtime"] = 8000;
okCoinWebSocket.lastHeartBeat = new Date().getTime()
function checkConnect() {
    socket.send("{'event':'ping'}");
    if ((new Date().getTime() - okCoinWebSocket.lastHeartBeat) > okCoinWebSocket.overtime) {
        console.log("socket 连接断开，正在尝试重新建立连接");
        //testWebSocket();
    }
}

socket.onopen = function (event) {
    console.log(lp+' WebSocket connect at time: ' + new Date());
    socket.send(substr);
    setInterval(checkConnect,5000);
};

socket.onmessage = function (event) {
    let raw_data = event.data;
    console.log(raw_data);
    // sub [{}]
    //raw_data = "asd";
    try {
        var jdata = JSON.parse(raw_data);
        if (jdata.event == 'pong') {
            okCoinWebSocket.lastHeartBeat = new Date().getTime();
            return
        }
    }
    catch (e)
    {
        console.log("e: " + e );
        return;
    }
};

socket.onclose = function(event) {
    console.log('WebSocket close at time: ' + new Date());
};