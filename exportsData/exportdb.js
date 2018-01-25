var levelDb = require('../db/leveldb/leveldbexportsutils')

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
    }
    catch (e){

    }
})