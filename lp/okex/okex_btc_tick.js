var url = "wss://real.okex.com:10441/websocket"

var req_orderinfo_btc = {
    'event': 'addChannel',
    'channel': 'ok_sub_spot_btc_usdt_ticker',
}

var req_orderinfo_ltc = {
    'event': 'addChannel',
    'channel': 'ok_sub_spot_ltc_usdt_ticker',
}

var req_orderinfo_eth = {
    'event': 'addChannel',
    'channel': 'ok_sub_spot_eth_usdt_ticker',
}


let WebSocket = require('ws');
let LevelDb = require("../../db/leveldb/leveldbtickutils")
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
        socket.send(JSON.stringify(req_orderinfo_btc));
        socket.send(JSON.stringify(req_orderinfo_ltc));
        socket.send(JSON.stringify(req_orderinfo_eth));
        setInterval(checkConnect, 5000);
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
        catch (e) {
            console.log("e: " + e);
            return;
        }
        if (jdata[0]) {

            var indexdata = jdata[0];
            var sym = indexdata.channel
            if("ok_sub_spot_btc_usdt_ticker" == sym){
                symbol = "_btc_"
            }
            else if("ok_sub_spot_ltc_usdt_ticker" == sym){
                symbol = "_ltc_"
            }
            else if("ok_sub_spot_eth_usdt_ticker" == sym){
                symbol = "_eth_"
            }
            if (indexdata.data) {
                var tick = indexdata.data;
                // buy(double): 买一价
                // high(double): 最高价
                // last(double): 最新成交价
                // low(double): 最低价
                // sell(double): 卖一价
                // timestamp(long)：时间戳
                // vol(double): 成交量(最近的24小时)
                var kl = {}
                kl.buy = tick.buy
                kl.high = tick.high
                kl.last = tick.last
                kl.low = tick.low
                kl.sell = tick.sell
                kl.timestamp = tick.timestamp
                kl.vol = tick.vol
                var ts = tick.timestamp
                var key = lp + symbol + ts
                kl.key = key
                var value = kl
                LevelDb.put(key, JSON.stringify(kl), function (err) {
                    if (err) {
                        console.log("okex tick leveldb err: " + err);
                    }
                });
            }
        }
    };

    socket.onclose = function (event) {
        console.log('WebSocket close at time: ' + new Date());
        setTimeout(connect, reconnectInterval);
    };
}
connect()