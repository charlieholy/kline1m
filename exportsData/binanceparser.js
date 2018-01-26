var readline = require('readline');
var fs = require('fs');
var os = require('os');

var fReadName = './_btc_binance.txt';
var fWriteName = './_btc_binance2.txt';
var fRead = fs.createReadStream(fReadName);
var fWrite = fs.createWriteStream(fWriteName);


var objReadline = readline.createInterface({
    input: fRead,
// 这是另一种复制方式，这样on('line')里就不必再调用fWrite.write(line)，当只是纯粹复制文件时推荐使用
// 但文件末尾会多算一次index计数   sodino.com
//  output: fWrite,
//  terminal: true
});


var index = 1;
var lastline;
var lastamount = Number(0);
objReadline.on('line', (line)=>{
    try{
        var jline = JSON.parse(line);
        var amount = Number(jline.amount);
        if(amount > lastamount){
            lastamount = amount
            lastline = line
        }
        else{
            lastamount = 0
            fWrite.write(lastline + os.EOL); // 下一行
        }
        console.log("amount: " + amount)
    }catch (e){
           console.log("e: " + e)
    }


});

objReadline.on('close', ()=>{
    console.log('readline close...');
});