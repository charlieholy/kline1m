let WebSocket = require('ws');
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
    };

    socket.onerror = function (event) {
        console.log(lp+ 'WebSocket error at time: ' + new Date());
        setTimeout(connect, reconnectInterval,lp,url);
    }
    socket.onclose = function (event) {
        console.log(lp+ 'WebSocket close at time: ' + new Date());
        setTimeout(connect, reconnectInterval,lp,url);
    };
}

class BaseConn{
    constructor(lp){
        this.url = lp.url
        this.name = lp.name
    }

    run(){
        connect(this.name,this.url)
    }

    restart(){
        connect(this.name,this.url)
    }
}

module.exports=BaseConn