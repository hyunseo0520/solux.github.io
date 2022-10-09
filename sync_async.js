//file system도 모듈이기 때문에 incldue/loading을 해 봐야 함.

var fs = require('fs'); //핸들링하기 위해서 require의 return 값을 fs에 담음. 

/*
//Sync
console.log(1);                          
var data = fs.readFileSync('data.txt', {encoding: 'utf8'});   //읽어올 때도 encoding 방식으로 읽어와야 함
console.log(data);  //readFileSync가 동기적인 방식으로 data.txt를 읽어서 return
*/

//Async
console.log(2);
fs.readFile('data.txt', {encoding:'utf8'}, function(err, data){
    console.log(3);
    console.log(data);
})
console.log(4);