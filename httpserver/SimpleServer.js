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

//http://localhost:12306/kline?db=okex1516531
app.get('/kline/',function (req,res) {
    console.log("originalUrl: " + req.originalUrl)
    var db = req.query.db;
    console.log("db: " + db);
    res.status(200)
    var lvdata = [];
    var find = {}
    find["prefix"] = db;
    levelDb.find(find,function (key,value) {
        //lvdatavalue;
        if(key==null) {
            res.json(lvdata)
        }
        //console.log(value);
        try {
            lvdata.push(JSON.parse(value));
        }
        catch (e){

        }
    })

});

