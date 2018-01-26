//wss://stream.binance.com:9443/ws/ethbtc@kline_1m

let WebSocket = require('ws');
let LevelDb = require("../../db/leveldb/leveldbtickutils")
let lp = "binance"
let symbol = "_btc_"
var reconnectInterval = 1000
var connect = function () {
    const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker'); //如果symbol = 'btccny'或者'ltccny' 请使用wss://api.huobi.com/ws
    var lastamount = 0
    var lastkl = {}
    socket.onopen = function (event) {
        console.log(lp + ' WebSocket connect at time: ' + new Date());
    };

    socket.onmessage = function (event) {
        let raw_data = event.data;
        try {
            let tick = JSON.parse(raw_data);
            var kl = {}
            kl.buy = tick.b
            kl.high = tick.h
            kl.low = tick.l
            kl.sell = tick.a
            kl.timestamp = tick.E
            kl.vol = tick.v
            var ts = kl.timestamp
            var key = lp + symbol + ts
            kl.key = key
            var value = kl
            LevelDb.put(key, JSON.stringify(kl), function (err) {
                if (err) {
                    console.log("okex tick leveldb err: " + err);
                }
            });
        }catch (e){}
        //console.log(raw_data)
    };

    socket.onclose = function (event) {
        console.log('WebSocket close at time: ' + new Date());
        setTimeout(connect, reconnectInterval);
    };
}
connect()