var levelDb = require('../db/leveldb/leveldbexportsutils')
var fs = require('fs')
var symbol = "_btc_"
var find = {}
find["prefix"] = "huopro"+symbol;
levelDb.find(find,function (key,value) {
    //lvdatavalue;
    if(key==null) {
       // res.json(lvdata)
    }
    //console.log(value);
    try {
        console.log(value);
        fs.appendFileSync(symbol+'huopro.txt', value + "\n",  function(err) {
            if (err) {
                return console.error(err);
            }
        })
    }
    catch (e){

    }
})