var app = require('express')();
var bodyParser = require('body-parser')
app.use(bodyParser.json());
var fs = require('fs');
var http = require('http');
var levelDb = require('../db/leveldb/leveldbutils')
app.use(bodyParser.urlencoded({ extended: false }));
var httpsServer = http.createServer(app);
var PORT = 12306;

httpsServer.listen(12306, function() {
    console.log('HTTPS Server is running on: http://localhost:%s', PORT);
});

// Welcome
app.get('/', function(req, res) {
    res.status(200).send('root');
    console.log("req: " + req);
});


app.get('/kline/',function (req,res) {
    console.log("originalUrl: " + req.originalUrl)
    res.status(200)
    var lvdata = [];
    var find = {}
    find["prefix"] = "okex151653"
    levelDb.find(find,function (key,value) {
        //lvdatavalue;
        if(key==null) {
            res.send(lvdata)
        }
        console.log(value);
        lvdata.push(value);
    })

});

