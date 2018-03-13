var url = "ws://192.168.88.22:8081"

var req_orderinfo_btc = {
    'event': 'subtick',
    'status': 'open',
}

let WebSocket = require('ws');

var reconnectInterval = 1000

const socket = new WebSocket(url);

socket.onopen = function (event) {
    console.log(' WebSocket connect at time: ' + new Date());
    //socket.send(JSON.stringify(req_orderinfo_btc));
};

socket.onmessage = function (event) {
    let raw_data = event.data;
    console.log(raw_data);
    //socket.close()
};

socket.onclose = function (event) {
    console.log('WebSocket close at time: ' + new Date());
};
