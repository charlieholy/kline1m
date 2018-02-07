var config = {
    markets:{
      usdt:{
          "btc":true,
          "eth":true,
          "ltc":true,
          "123":false,
          "456":false
      },
      btc:{
          "eth":true
      }
    },
    lps:{
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
        bitfinex:{
            name:"bitfinex",
            open:true,
            url:"wss://api.bitfinex.com/ws/2"
        }
    }
}

exports.config = config;