var conws = require("./wstmplete")
var clps = require("../config")
var lps = clps.lps
for(v in lps){
    var cws = new conws(lps[v])
    cws.run()
}
