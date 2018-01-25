var levelDb = require('../db/leveldb/leveldbexportsutils')
var fs = require('fs')

var find = {}
find["prefix"] = "bitfinex";
levelDb.find(find,function (key,value) {
    //lvdatavalue;
    if(key==null) {
       // res.json(lvdata)
    }
    //console.log(value);
    try {
        console.log(value);
        fs.appendFile('bitfinex.txt', value + "\n",  function(err) {
            if (err) {
                return console.error(err);
            }
        })
    }
    catch (e){

    }
})