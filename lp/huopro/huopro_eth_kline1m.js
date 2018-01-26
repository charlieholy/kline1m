let WebSocket = require('ws');
let pako = require('pako');
let LevelDb = require("../../db/leveldb/leveldbutils")
let lp = "huopro"
let symbol = "_eth_"
var reconnectInterval = 1000
var connect = function() {
    var lastamount = 0
    var lastkl = {}
    const socket = new WebSocket('wss://api.huobi.pro/ws'); //如果symbol = 'btccny'或者'ltccny' 请使用wss://api.huobi.com/ws

    socket.onopen = function (event) {
        console.log(lp + ' WebSocket connect at time: ' + new Date());
        socket.send(JSON.stringify({'sub': 'market.ethusdt.kline.1min'}));
    };

    socket.onmessage = function (event) {
        let raw_data = event.data;
        let json = pako.inflate(new Uint8Array(raw_data), {to: 'string'});
        let data = JSON.parse(json);

        //console.log('WebSocket receive message at time: ' + new Date());
        //console.log(data);
        //
        /* deal with server heartbeat */
        if (data['ping']) {
            //console.log('WebSocket receive ping and return pong at time: ' + new Date());
            socket.send(JSON.stringify({'pong': data['ping']}));
            return;
        }

        var ts = data.ts;
        var tick = data.tick;
        // "amount": 成交量,
        //     "count": 成交笔数,
        //     "open": 开盘价,
        //     "close": 收盘价,当K线为最晚的一根时，是最新成交价
        // "low": 最低价,
        //     "high": 最高价,
        //     "vol": 成交额, 即 sum(每一笔成交价 * 该笔的成交量)
        if (tick) {
            var kl = {}
            kl["ts"] = ts.toString();
            kl["amount"] = tick.amount.toString()
            kl["open"] = tick.open.toString()
            kl["close"] = tick.close.toString()
            kl["low"] = tick.low.toString()
            kl["high"] = tick.high.toString()
            var amount = tick.amount
            if(amount> lastamount){
                lastamount = amount
                lastkl = kl
            }
            else{
                lastamount = 0
                LevelDb.put(lp + symbol + ts, JSON.stringify(lastkl), function (err) {
                    if (err) {
                        console.log("huopro leveldb err: " + err);
                    }
                });
            }

        }


    };

    socket.onclose = function (event) {
        console.log('WebSocket close at time: ' + new Date());
        setTimeout(connect, reconnectInterval);
    };
}
connect();