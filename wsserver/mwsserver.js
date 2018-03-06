var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server
wss = new WebSocketServer({ port: 8081 });

var num = 0;
let clientnum = 0
//'open', 'error', 'close', 'message'
wss.on('connection', function(ws) {
    console.log("conn: "+ clientnum++);
    ws.on('message', function(message) {
        console.log("msg: " + message);
        num++
        ws.send("pong" + num);
    });
    ws.on('close', function () {
        console.log("onclose");
    });
    ws.on('error',function (err) {
        console.log("err",err);
    })
    ws.on('open',function () {
        console.log("onopen");
    })
});