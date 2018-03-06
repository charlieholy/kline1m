var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server
wss = new WebSocketServer({ port: 8081 });

var g_ws = [];

var num = 0;
let clientnum = 0
//'open', 'error', 'close', 'message'
wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log("msg: " + message);
        num++
        ws.send("pong" + num);
        broadCase("num: " + num);
    });
    ws.on('close', function (ws) {
        console.log("onclose");

    });
    ws.on('error',function (err) {
        console.log("err",err);
    })
    ws.on('open',function () {
        console.log("onopen");
    })

});

var broadCase = function () {
    wss.clients.forEach(function (ws) {
        ws.send("asd");
    })
}
