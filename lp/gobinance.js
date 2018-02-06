var conws = require("./wstmplete")
var clps = require("../config")
require("./okex")
var ev = require("./bowevent")


var lps = clps.lps
for(v in lps){
    var cws = new conws(lps[v])
    cws.run()
}


ev.evE.emit("sub",d);
ev.evE.on("msg",function (dd) {
    var lp = dd.lp
    if("okex" == lp){
        console.log("okex: " + dd.msg)
    }

})
ev.evE.on("onopen",function (lp) {
    if("okex" == lp){
        ev.evE.emit("sub",d);
    }
})


