var levelDb = require('../db/leveldb/leveldbexportsutils')
var fs = require('fs')

var find = {}
find["prefix"] = "okex";
levelDb.find(find,function (key,value) {
    //lvdatavalue;
    if(key==null) {
       // res.json(lvdata)
    }
    //console.log(value);
    try {
        console.log(value);
        fs.appendFile('okex.txt', value + "\n",  function(err) {
            if (err) {
                return console.error(err);
            }
        })
    }
    catch (e){

    }
})

//https://www.okex.com/v2/markets/btc_usdt/kline?since=0&marketFrom=btc_usdt&type=day&limit=1000&coinVol=0
//https://www.okex.com/v2/markets/btc_usdt/kline?since=0&marketFrom=btc_usdt&type=1hour&limit=1000&coinVol=0
//https://www.okex.com/v2/markets/btc_usdt/kline?since=0&marketFrom=btc_usdt&type=1min&limit=1000&coinVol=0