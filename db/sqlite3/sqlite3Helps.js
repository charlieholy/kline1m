// used:
var HandleDB = require("./sqlite3Handle")
let db = new HandleDB({
    databaseFile: './master.db',
    tableName: 'dboo2'
});

db.connectDataBase().then((result)=>{
    console.log(result);
// 创建表(如果不存在的话,则创建,存在的话, 不会创建的,但是还是会执行回调)
let sentence = `
       create table if not exists ${db.tableName}(
            jkey varchar(225),
            jvalue varchar(1000)
        );`;
return db.createTable(sentence);
}).then((result)=>{
    console.log(result);
}).catch((err)=>{
    console.error(err);
});


// 增
var add = function(key,value){
    db.sql(`insert into ${db.tableName} (jkey, jvalue) values(?, ?)`,
        [key, value]).then((res)=>{
       // console.log(res);
}).catch((err)=>{
        console.log(err);
});
}


var req = function (key) {
    // 查
    db.sql(`select jvalue from ${db.tableName} where jkey = ?`, key, 'all').then((res)=>{
        console.log(res);
}).catch((err)=>{
        console.log("req_err: " + err);
});
}
exports.add = add;
exports.req = req;
