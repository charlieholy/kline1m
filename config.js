var lps = {
    okex:{
        name:"okex",
        open:true,
        url:"wss://real.okex.com:10441/websocket"
    },
    huopro:{
        name:"huopro",
        open:true,
        url:"wss://api.huobi.pro/ws"
    },
    binance:{
        name:"binance",
        open:true,
        url:"wss://stream.binance.com:9443/ws/btcusdt@depth5"
    },
    bitfinex:{
        name:"bitfinex",
        open:true,
        url:"wss://api.bitfinex.com/ws/2"
    }
}

exports.lps = lps;