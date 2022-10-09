//http 모듈 사용
const http = require('http');


const hostname = '127.0.0.1';
const port = 1337;

/*Example 1
//http 변수에 담겨있는 객체가 가지고 있는 createServer 함수 호출
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
*/

//Example 2
//server 라는 객체를 통해서 서버를 조작할 수 있음
var server = http.createServer(function(req, res){
    //실제로 포트를 통해 사용자가 접속하였을 때 어떠한 내용을 출력할 것인가.
    //request  : 요청와 관련된 정보를 담고 있는 객체
    //response : 응답과 관련된 정보를 담고 있는 객체
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
});
//server가 port(1337번)를 바라보게 함 => port
//어떤 IP를 타고 들어온 사용자를 수용할 것인가 => hostname
server.listen(port, hostname, function(){
    //listen 함수는 시간이 오래 소요될 수 있기 때문에 콜백 함수를 사용.
    //listen이 완료되어 있을 때 이 콜백 함수가 실행되도록 약속 되어 있는 것
    console.log(`Server running at http://${hostname}:${port}/`);
});