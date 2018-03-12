var conws = require("./wstmplete")
var config = require("../config").config
require("./pushdb")
//require("./okex")
require("./huopro")
//require("./binance")
//require("./bitfinex")
require("../wsserver/mwsserver")
var ev = require("./bowevent")

var lps = config.lps
for(v in lps){
    var cws = new conws(lps[v])
    cws.run()
}

