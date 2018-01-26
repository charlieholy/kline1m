//wss://stream.binance.com:9443/ws/ethbtc@kline_1m

let WebSocket = require('ws');
let LevelDb = require("../../db/leveldb/leveldbutils")
let lp = "bitfinex"
let symbol = "_btc_"
var reconnectInterval = 1000
var chn = {}
var connect = function () {

    const socket = new WebSocket('wss://api.bitfinex.com/ws/2'); //如果symbol = 'btccny'或者'ltccny' 请使用wss://api.huobi.com/ws
    let btctiker = JSON.stringify(
        {
            "event":"subscribe",
            "channel":"ticker",
            "pair":"BTCUSD"
        }
    )
    let ltctiker = JSON.stringify(
        {
            "event":"subscribe",
            "channel":"ticker",
            "pair":"LTCUSD"
        }
    )
    let ethtiker = JSON.stringify(
        {
            "event":"subscribe",
            "channel":"ticker",
            "pair":"ETHUSD"
        }
    )

    socket.onopen = function (event) {
        console.log(lp + ' WebSocket connect at time: ' + new Date());
        socket.send(btctiker)
        socket.send(ltctiker)
        socket.send(ethtiker)
    };
// MTS	int	millisecond time stamp
// OPEN	float	First execution during the time frame
// CLOSE	float	Last execution during the time frame
// HIGH	float	Highest execution during the time frame
// LOW	float	Lowest execution during the timeframe
// VOLUME	float	Quantity of symbol traded within the timeframe
    socket.onmessage = function (event) {
        let raw_data = event.data;
        try {
            var data = JSON.parse(raw_data);
        }
        catch (e){

        }
        console.log("da: " + raw_data)
        if(data.pair){
            var pair = data.pair
            var chnid = data.chanId;
            if("BTCUSD" == pair){
                chn._btc_ = chnid;
            }
            else if("LTCUSD" == pair){
                chn._ltc_ = chnid
            }
            else if("ETHUSD" == pair){
                chn._eth_ = chnid
            }
        }
        if (data.length > 1) {
            var chid = data[0]
            if(chn._btc_ == chid){
                symbol = "_btc_"
            }
            else if(chn._ltc_ == chid){
                symbol = "_ltc_"
            }
            else if(chn._eth_ == chid){
                symbol = "_eth_"
            }
            if (data[1][0].length > 1) {
                return
            }
            var tick = data[1];
            if (tick.length > 4) {
                var kl = {}
                kl.buy = tick[0]
                kl.high = tick[8]
                kl.last = tick[6]
                kl.low = tick[9]
                kl.sell = tick[2]
                kl.timestamp = new Date().getTime()
                kl.vol = tick[7]
                var ts = kl.timestamp
                var key = lp + symbol + ts
                kl.key = key
                var value = kl
                LevelDb.put(key, JSON.stringify(kl), function (err) {
                    if (err) {
                        console.log("okex tick leveldb err: " + err);
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
connect()