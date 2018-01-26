var a = "asd"
var b = "asd3"

var arr = [];
arr.push(a);
arr.push(b)

console.log(arr)
 var s = "{\"ts\":1516537430853,\"amount\":4.876771705420127,\"open\":12117.37,\"close\":12137.87,\"low\":12100.87,\"high\":12138.02}"
var d = JSON.parse(s);
console.log("d: " + d.amount)

console.log(new Date())