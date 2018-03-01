let WebSocket = require('ws');
var ev = require("./bowevent")
let pako = require('pako');
var Log = require("../log4js/Loger")
var reconnectInterval = 5000

var isconnect = function () {
    
}

var pingStamp = 0;

var connect = function (lp,url) {
    let m_lp = lp
    let m_url = url
    const socket = new WebSocket(url);

    function checkConnect() {
        if("bitfinex" == lp || "okex" == lp){
            socket.send("{'event':'ping'}");
        }
        ev.evE.emit("check_sub");
    }

    socket.onopen = function (event) {
        console.log(lp + " " + url + ' WebSocket connect at time: ' + new Date());
        setInterval(checkConnect, 5000);
        //console.log("state: " + socket.readyState)
        ev.evE.emit("onopen"+lp);
    };

    socket.onmessage = function (event) {
        let raw_data = event.data;
        ev.evE.emit(lp,raw_data);

        if("binance" == lp){
            var msg = {}
            msg.url = url
            msg.data = raw_data
            ev.evE.emit("msg"+lp,msg);
            return;
        }
        ev.evE.emit("msg"+lp,raw_data);
    };

   socket.onerror = function (event) {
       console.log(lp+ 'WebSocket error at time: ' + new Date());
        //setTimeout(connect, reconnectInterval,lp,url);
    }
    socket.onclose = function (event) {
        console.log(lp+ 'WebSocket close at time: ' + new Date());
        socket.close()
        setTimeout(connect, reconnectInterval,lp,url);
    };

    var ready2send = function () {
        if( socket.readyState == 3)
        {
            console.log("====================ready2send")
            socket.close();
            setTimeout(connect, reconnectInterval,lp,url);
        }
    }

    ev.evE.on(lp,function (data) {
        var m_data = data
        if("huopro" == lp)
        {
            let json = pako.inflate(new Uint8Array(m_data), {to: 'string'});

            let data = JSON.parse(json);
            if (data['ping']) {
                console.log("huopro: " + json);
                if(pingStamp == json)
                {
                    return;
                }
                pingStamp = json
                try {
                    socket.send(JSON.stringify({'pong': data['ping']}));
                }
                catch (e)
                {
                    console.log("============senderr: " + e );
                }
                return;
            }
        }
    })

    ev.evE.on("sub"+lp,function (data) {
        var req = data;
        if(socket.readyState == 1){
            socket.send(req);
            Log.debug("sub: " + lp + " " + req);
        }
        else {
            //setTimeout(connect, reconnectInterval,lp,url);
            Log.debug("sub: socket not ready!");
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