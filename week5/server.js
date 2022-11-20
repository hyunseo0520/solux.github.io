var express = require('express');
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

app.get('/', function(req, res) { 
    res.sendFile(__dirname +'/index.html')
});

app.get('/write', function(req, res) { 
    res.sendFile(__dirname +'/write.html')
});

app.post('/add', function(req, res){
    res.send('전송완료')
    console.log(req.body.title);
    console.log(req.body.date);
});

// 연결 완료 메세지 출력
app.listen(3000, function(){
    console.log('Connected, 3000 port!');
});
