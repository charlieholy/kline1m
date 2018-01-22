//wss://stream.binance.com:9443/ws/ethbtc@kline_1m

let WebSocket = require('ws');
let LevelDb = require("../../db/leveldb/leveldbutils")
let lp = "bitfinex"
var reconnectInterval = 1000
var connect = function () {

    const socket = new WebSocket('wss://api.bitfinex.com/ws/2'); //如果symbol = 'btccny'或者'ltccny' 请使用wss://api.huobi.com/ws
    let msg = JSON.stringify(
        {
            event: "subscribe",
            channel: "candles",
            key: "trade:1m:tBTCUSD"
        }
    )

    socket.onopen = function (event) {
        console.log(lp + ' WebSocket connect at time: ' + new Date());
        socket.send(msg)
    };
// MTS	int	millisecond time stamp
// OPEN	float	First execution during the time frame
// CLOSE	float	Last execution during the time frame
// HIGH	float	Highest execution during the time frame
// LOW	float	Lowest execution during the timeframe
// VOLUME	float	Quantity of symbol traded within the timeframe
    socket.onmessage = function (event) {
        let raw_data = event.data;
        let data = JSON.parse(raw_data);
        //console.log("da: " + raw_data)
        if (data.length > 1) {
            if (data[1][0].length > 1) {
                return
            }
            var tick = data[1];
            if (tick.length > 4) {
                var kl = {}
                var ts = tick[0]
                kl["ts"] = tick[0];
                kl["amount"] = tick[5]
                kl["open"] = tick[1]
                kl["close"] = tick[2]
                kl["low"] = tick[4]
                kl["high"] = tick[3]
                var key = lp + ts
                var value = kl
                //console.log("key: " + key)
                //console.log("value: " + value)
                LevelDb.put(key, JSON.stringify(kl), function (err) {
                    if (err) {
                        console.log("okex leveldb err: " + err);
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