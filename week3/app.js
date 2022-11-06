const { response } = require('express');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();

app.locals.pretty = true;
app.set('views', './views');
app.set('view engine', 'jade');

//public이라는 디렉토리에 정적인 파일 저장하면 사용자에게 서비스 할 수 있음.
app.use(express.static('public'));    //사용자가 웹 서버에 접속하는 방식 설정, URL를 입력하여 접속 => get 방식
app.use(bodyParser.urlencoded({ extended: false}))

app.get('/form', function(req, res) {
    res.render('form');
})
app.get('/form_receiver', function(req, res) {
    var title = req.query.title;
    var description = req.query.description;
    res.send(title+','+description);
})

app.post('/form_receiver', function(req, res) {
    var title = req.body.title;
    var description = req.body.description;
    res. send(title+','+description);
})

//파라미터 방식
app.get('/topic/:id', function(req, res) {
    //id에 저장될 내용을 topics에 입력
    var topics = [
        'Javascript is ...',
        'Nodejs is ...',
        'Express is ...'
    ];
    var output = `
    <a href = "/topic/0">JavaScript</a><br>
    <a href = "/topic/1">Nodejs</a><br>
    <a href = "/topic/2">Express</a><br><br>
    ${topics[req.params.id]}
    `
    res.send(output);
})

app.get('/topic/:id/:mode', function(req, res) {
    res.send(req.params.id+','+req.params.mode)
})

app.get('/template', function(req, res){
    // /template이라는 경로를 통하여 들어온 사용자에게 function이 실행되면서 temp 파일을 웹페이지로 렌더링해여 전송함.
    res.render('temp', {time:Date(), _title:'Jade'});
});
app.get('/', function(req, res){
    //사용자가 home으로 접속하면 두번째 인자로 전달한 함수가 실행되도록 약속되어 있음.
    //req : 사용자가 요청한 것과 관련된 객체
    //res : 요청한 정보에 대해서 응답을 할 수 있는 방법을 담고 있는 객체
    res.send("Hello~ Home page!!") //이 값으로 응답할 것이다
});
//수정 후에 reload로 수정되지 않음 => 서버 종료 후 다시 실행해야 함.
app.get('/dynamic', function(req, res){
    var time = Date();
    var lis = '';
    for (var i = 0; i<5; i++) {
        lis = lis + '<li>coding</li>';
    }
    /*
    별도의 문법을 사용하지 않고 ` 을 사용하면
    html 코드를 그대로 가져와서 사용 할 수 있음.
    */
    var output = `
    <!DOCTYPE html>
    <html>
        <head>
        </head>
        <body>
            Hello, Dynamic!
            <ul>
            ${lis}
            </ul>
            ${time}
        </body>
    </html>`
    res.send(output)
})
app.get('/route', function(req, res){
    res.send('Hello Router, <img src="/snow.png">')
})
app.get('/login', function(req, res){
    res.send('<h1>Login Please~!</h1>');
})
app.listen(3000, function(){
    console.log('Connected 3000 Port!');
});
