var url = "wss://real.okex.com:10441/websocket"

var req_orderinfo = {
    'event': 'addChannel',
    'channel': 'ok_sub_spot_btc_usdt_kline_1min',
}

var sub = req_orderinfo
// see readme
var substr = JSON.stringify(sub);
console.log("substr: " + substr);

let WebSocket = require('ws');
let LevelDb = require("../../db/leveldb/leveldbutils")
let lp = "okex"
let symbol = "_btc_"

var reconnectInterval = 1000
var connect = function () {

    const socket = new WebSocket(url);
    var okCoinWebSocket = {}
    okCoinWebSocket.overtime = 8000;
    okCoinWebSocket.lastHeartBeat = new Date().getTime()

    function checkConnect() {
        socket.send("{'event':'ping'}");
        if ((new Date().getTime() - okCoinWebSocket.lastHeartBeat) > okCoinWebSocket.overtime) {
            console.log("socket 连接断开，正在尝试重新建立连接");
            setTimeout(connect, reconnectInterval);
        }
    }

    socket.onopen = function (event) {
        console.log(lp + ' WebSocket connect at time: ' + new Date());
        socket.send(substr);
        setInterval(checkConnect, 5000);
    };

    socket.onmessage = function (event) {
        let raw_data = event.data;
        // console.log(raw_data);
        // sub [{}]
        //raw_data = "asd";
        try {
            var jdata = JSON.parse(raw_data);
            if (jdata.event == 'pong') {
                okCoinWebSocket.lastHeartBeat = new Date().getTime();
                return
            }
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
    };

    socket.onerror = function (event) {
        console.log('WebSocket error at time: ' + new Date());
        setTimeout(connect, reconnectInterval);
    }
    socket.onclose = function (event) {
        console.log('WebSocket close at time: ' + new Date());
        setTimeout(connect, reconnectInterval);
    };
}
connect()