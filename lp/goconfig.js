var conws = require("./wstmplete")
var config = require("../config").config
require("./okex")
var ev = require("./bowevent")

var lps = config.lps
for(v in lps){
    var cws = new conws(lps[v])
    cws.run()
}

