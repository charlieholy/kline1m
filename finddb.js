let LevelDb = require("./db/leveldb/leveldbutils")

LevelDb.find("151653",function (err,info) {
    console.log("info: " + info)
})