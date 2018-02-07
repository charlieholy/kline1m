var redis = require('redis'),
    RDS_PORT = 6379,        //端口号
    RDS_HOST = '127.0.0.1',    //服务器IP
    RDS_OPTS = {},            //设置项
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);

/*   Redis支持五种数据类型：string（字符串），hash（哈希），list（列表），set（集合）及zset(sorted set：有序集合)。
    string ==>
    SET name "runoob"
    GET name

    set ==>
    sadd
    smembers


    k:BTCUSD:1m  hash ==>
    HGETALL k:BTCUSD:1m
    HGET k:BTCUSD:1m  "1514957640"
"[\"9036\", \"8319\", \"9036\", \"8319\", \"20\", \"173550\"]"


*   keys *
*   TYPE KEY_NAME
*
*   k:markets set
*   alert:message list RPUSH alert:message %s
* */


client.on('ready',function(res){
    console.log('ready');
});

var redis = require('redis');
var util = require('util');

var client = redis.createClient(6379,'127.0.0.1');


//字符串类型的数据操作
var key="game:diamond";
var value="100";
client.set(key,value,function(err,res){
    if(err){
        console.log(err);
    }else{
        console.log(util.inspect(res));
    }
});


client.get(key,function(err,res){
    if(err){
        console.log(err);
    }else{
        console.log(util.inspect(res));
    }
});

client.incr(key,function(err,res){
    if(err){
        console.log(err);
    }else{
        console.log(util.inspect(res));
    }
});




//散列表类型数据操作
key="game:task";
value={
    userid:"12345677",
    taskid:"1",
    diamond:"100"
};


client.hmset(key,value,function(err,res){
    if(err){
        console.log(err);
    }else{
        console.log(util.inspect(res));
    }
});

client.hmget(key,['userid','taskid'],function(err,res){
    if(err){
        console.log(err);
    }else{
        console.log(util.inspect(res));
    }
});


client.hset(key,'taskid','2',function(err,res){
    if(err){
        console.log(err);
    } else{
        console.log(util.inspect(res));
    }
});

client.hget(key,'taskid',function(err,res){
    if(err){
        console.log(err);
    } else{
        console.log(util.inspect(res));
    }
});

client.hgetall(key,function(err,res){
    if(err){
        console.log(err);
    } else{
        console.log(util.inspect(res));
    }
});

client.hexists(key,'taskid',function(err,res){
    if(err){
        console.log(err);
    } else{
        console.log(util.inspect(res));
    }
});

client.hincrby(key,'diamond',100,function(err,res){
    if(err){
        console.log(err);
    } else{
        console.log(util.inspect(res));
    }
});

client.hdel(key,'diamond',function(err,res){
    if(err){
        console.log(err);
    } else{
        console.log(util.inspect(res));
    }
});





//列表类型操作
key="game:taskIDList";

client.lpush(key,"1",function(err,res){
    if(err){
        console.log(err);
    } else{
        console.log(util.inspect(res));
    }
});

client.rpush(key,"2",function(err,res){
    if(err){
        console.log(err);
    } else{
        console.log(util.inspect(res));
    }
});

client.llen(key,function(err,res){
    if(err){
        console.log(err);
    } else{
        console.log(util.inspect(res));
    }
});

client.lrange(key,0,2,function(err,res){
    if(err){
        console.log(err);
    } else{
        console.log(util.inspect(res));
    }
});

client.lrem(key,0,1,function(err,res){
    if(err){
        console.log(err);
    } else{
        console.log(util.inspect(res));
    }
});

function lrange(key,start,end) {
    client.lrange(key,start,end,function(err,res){
        if(err){
            console.log(err);
        } else{
            console.log(util.inspect(res));
        }
    });
}

function rpush(key,value) {
    client.rpush(key,value,function(err,res){
        if(err){
            console.log(err);
        } else{
            console.log(util.inspect(res));
        }
    });
}

exports.rpush = rpush;
exports.lrange = lrange;
//其他关于集合和有序集合操作类似


