let WebSocket = require('ws');
let pako = require('pako');

const socket = new WebSocket('wss://api.huobi.pro/ws'); //如果symbol = 'btccny'或者'ltccny' 请使用wss://api.huobi.com/ws

socket.onopen = function (event) {
    console.log('WebSocket connect at time: ' + new Date());
    socket.send(JSON.stringify({'sub': 'market.btcusdt.kline.1min'}));
};

socket.onmessage = function (event) {
    let raw_data = event.data;
    let json = pako.inflate(new Uint8Array(raw_data), {to: 'string'});
    let data = JSON.parse(json);

    console.log('WebSocket receive message at time: ' + new Date());
    console.log(data);

    /* deal with server heartbeat */
    if (data['ping']) {
        console.log('WebSocket receive ping and return pong at time: ' + new Date());
        socket.send(JSON.stringify({'pong': data['ping']}));
    }
};

socket.onclose = function(event) {
    console.log('WebSocket close at time: ' + new Date());
};