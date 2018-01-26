var levelup = require('level');
var db = levelup(__dirname + "/ticker" + new Date().getTime()); //这里的路径就是物理存储数据的文件路径,建议不要放到项目中.
let logger = require("../../log4js/Loger")


function put(key, value, callback) {
    if (key && value) {
        console.log("key: " + key + " value: " + value)
        logger.debug("key: " + key + " value: " + value)
        db.put(key, value, function (error) {
            callback(error);
        })
    } else {
        callback('no key or value');
    }
}

function get(key, callback) {
    if (key) {
        db.get(key, function (error, value) {
            callback(error, value);
        })
    } else {
        callback('no key', key);
    }
}

function del(key, callback) {
    if (key) {
        db.del(key, function (error) {
            callback(error);
        })
    } else {
        callback('no key');
    }
}

function batch(arr, callback) {
    if (Array.isArray(arr)) {
        var batchList = [];
        arr.forEach(item)
        {
            var listMember = {};
            if (item.hasOwnProperty('type')) {
                listMember.type = item.type;
            }
            if (item.hasOwnProperty('key')) {
                listMember.key = item.key;
            }
            if (item.hasOwnProperty('value')) {
                listMember.value = item.value;
            }
            if (listMember.hasOwnProperty('type') && listMember.hasOwnProperty('key') && listMember.hasOwnProperty('value')) {
                batchList.push(listMember);
            }
        }
        if (batchList && batchList.length > 0) {
            db.batch(batchList, function (error) {
                callback(error, batchList);
            })
        } else {
            callback('array Membre format error');
        }
    } else {
        callback('not array');
    }
}

function find(find, callback) {
    var option = {keys: true, values: true, revers: false, limit: 10000, fillCache: true};
    if (!find)
        return callback('nothing', null);
    else {
        if (find.prefix) {
            option.start = find.prefix;
            option.end = find.prefix.substring(0, find.prefix.length - 1)
                + String.fromCharCode(find.prefix[find.prefix.length - 1].charCodeAt() + 1);
        }

        if (find.limit)
            option.limit = find.limit;

        db.createReadStream(option).on('data',function (data) {
            data&&callback(data.key, data.value);
        }).on('error',function (err) {
        }).on('close',function () {
        }).on('end', function () {
            return callback(null, Date.now());
        });
    }
}

exports.put = put;
exports.get = get;
exports.del = del;
exports.find = find;
exports.batch = batch;