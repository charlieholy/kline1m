let WebSocket = require('ws');
let pako = require('pako');
let LevelDb = require("../../db/leveldb/leveldbtickutils")
let lp = "huopro"
let symbol = "_btc_"
var reconnectInterval = 1000
var connect = function() {
    var lastamount = 0
    var lastkl = {}
    const socket = new WebSocket('wss://api.huobi.pro/ws'); //如果symbol = 'btccny'或者'ltccny' 请使用wss://api.huobi.com/ws

    socket.onopen = function (event) {
        console.log(lp + ' WebSocket connect at time: ' + new Date());
        socket.send(JSON.stringify({'sub': 'market.btcusdt.trade.detail'}));
    };

    socket.onmessage = function (event) {
        let raw_data = event.data;
        let json = pako.inflate(new Uint8Array(raw_data), {to: 'string'});
        let data = JSON.parse(json);

        //console.log('WebSocket receive message at time: ' + new Date());
        console.log(json);
        //
        /* deal with server heartbeat */
        if (data['ping']) {
            //console.log('WebSocket receive ping and return pong at time: ' + new Date());
            socket.send(JSON.stringify({'pong': data['ping']}));
            return;
        }



    };

    socket.onclose = function (event) {
        console.log('WebSocket close at time: ' + new Date());
        setTimeout(connect, reconnectInterval);
    };
}
connect();