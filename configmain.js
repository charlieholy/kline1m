var config = require("./config")
var lps = config.lps
for(var v of Object.keys(lps)){
    console.log("v: " + v)
    var lp = lps[v];
    var url = lp.url;
    console.log("url: " + url)

}