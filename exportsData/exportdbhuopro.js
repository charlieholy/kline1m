var levelDb = require('../db/leveldb/leveldbexportsutils')
var fs = require('fs')

var find = {}
find["prefix"] = "huopro";
levelDb.find(find,function (key,value) {
    //lvdatavalue;
    if(key==null) {
       // res.json(lvdata)
    }
    //console.log(value);
    try {
        console.log(value);
        fs.appendFileSync('huopro.txt', value + "\n",  function(err) {
            if (err) {
                return console.error(err);
            }
        })
    }
    catch (e){

    }
})