var ppdb = require("../db/sqlite3/sqlite3Helps")
var redis = require("../db/redis/redisutils")
var ev = require("./bowevent")

ev.evE.on("pushdb",function (key,value) {
    if(key && value){
        console.log("key: " + key + " value: " + value);
        ppdb.add(key,value)
        //redis.rpush(key,value)
    }

})