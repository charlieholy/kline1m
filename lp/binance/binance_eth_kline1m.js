//wss://stream.binance.com:9443/ws/ethbtc@kline_1m

let WebSocket = require('ws');
let LevelDb = require("../../db/leveldb/leveldbutils")
let lp = "binance"
let symbol = "_eth_"
var reconnectInterval = 1000
var connect = function () {
    const socket = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@kline_1m'); //如果symbol = 'btccny'或者'ltccny' 请使用wss://api.huobi.com/ws
    var lastamount = 0
    var lastkl = {}
    socket.onopen = function (event) {
        console.log(lp + ' WebSocket connect at time: ' + new Date());
    };

    socket.onmessage = function (event) {
        let raw_data = event.data;
        let data = JSON.parse(raw_data);
        var ts = data.E
        var k = data.k
        if (k) {
            var kl = {}
            kl["ts"] = ts;
            kl["amount"] = k.v
            kl["open"] = k.o
            kl["close"] = k.c
            kl["low"] = k.l
            kl["high"] = k.h
            var key = lp + symbol + ts
            var value = JSON.stringify(kl)
            //console.log("key: " + key)
            //console.log("value: " + value)
            var amount = Number(k.v)
            if(amount > lastamount){
                lastamount = amount
                lastkl = kl
            }
            else{
                lastamount = 0
                LevelDb.put(key, JSON.stringify(lastkl), function (err) {
                    if (err) {
                        console.log("huopro leveldb err: " + err);
                    }
                });
            }

        }
        //console.log(raw_data)
    };

    socket.onclose = function (event) {
        console.log('WebSocket close at time: ' + new Date());
        setTimeout(connect, reconnectInterval);
    };
}
connect()