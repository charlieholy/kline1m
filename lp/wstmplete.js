let WebSocket = require('ws');
var ev = require("./bowevent")
let pako = require('pako');
var reconnectInterval = 5000

var connect = function (lp,url) {
    let m_lp = lp
    let m_url = url
    const socket = new WebSocket(url);

    function checkConnect() {
    }

    socket.onopen = function (event) {
        console.log(lp + ' WebSocket connect at time: ' + new Date());
    };

    socket.onmessage = function (event) {
        let raw_data = event.data;
        ev.evE.emit(lp,raw_data);
    };

    socket.onerror = function (event) {
        console.log(lp+ 'WebSocket error at time: ' + new Date());
        setTimeout(connect, reconnectInterval,lp,url);
    }
    socket.onclose = function (event) {
        console.log(lp+ 'WebSocket close at time: ' + new Date());
        setTimeout(connect, reconnectInterval,lp,url);
    };
    ev.evE.on(lp,function (data) {
        var m_data = data
        if("huopro" == lp)
        {
            let json = pako.inflate(new Uint8Array(m_data), {to: 'string'});
            //console.log("huopro: " + json);
            let data = JSON.parse(json);
            if (data['ping']) {
                socket.send(JSON.stringify({'pong': data['ping']}));
                return;
            }
        }
    })
}

class BaseConn{
    constructor(lp){
        this.url = lp.url
        this.name = lp.name
    }

    run(){
        connect(this.name,this.url)
    }
}

module.exports=BaseConn