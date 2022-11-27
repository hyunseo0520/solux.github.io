var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const { reset } = require('nodemon');
const MongoClient = require('mongodb').MongoClient;
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');

//middleware
app.use('/public', express.static('public'));

var db;
MongoClient.connect('mongodb+srv://lovelykitty0520:ysn09016@cluster0.ay4i2wd.mongodb.net/?retryWrites=true&w=majority',
    function(error, client) {
        // error가 발생했을 떄의 출력
        if(error) return console.log(error)

        // todoapp이라는 database에 연결 요청
        db = client.db('todoapp');
        // 데이터 저장
        // db.collection('post').insertOne({name:'현서', age:20, _id: 100}, function(error, result){
        //     console.log('save success!');
        // });

        // 연결 완료 메세지 출력
        app.listen(3000, function(){
            console.log('Connected, 3000 port!');
    });
})

app.get('/', function(req, res) { 
    res.render('index.ejs');
});

app.get('/write', function(req, res) { 
    res.render('write.ejs');
});

app.get('/list', function(req, res) {
    //데이터 꺼내는 것이 우선
    // DB에 저장된 데이터를 꺼내기 (post라는 컬렉션 안의 모든/일부/id가 @@인 데이터 요청)
    db.collection('post').find().toArray(function(error, result){
        // console.log(result);
        res.render('list.ejs', {posts: result});
    });
});

app.post('/add', function(req, res) {
    res.send('전송완료');
    db.collection('counter').findOne({name: "게시물갯수"}, function(error, result){
        console.log(result.totalPost); //총 게시물 갯수
        var totalPostnum = result.totalPost;
        db.collection('post').insertOne({_id: totalPostnum, title:req.body.title , date: req.body.date }, function() {
            console.log('save success!');
            //counter라는 collection에 있는 totalPost라는 항목도 1 증가시켜야함
            db.collection('counter').updateOne({name: '게시물갯수'}, {$inc: {totalPost:1}}, function(error, result){
                if(error) {return console.log(error)}
            });
        });
    });
});

app.delete('/delete', function(req, res){
    console.log(req.body);
    //정수로 변환해주기
    req.body._id = parseInt(req.body._id);
    //req.body에 담긴 게시물 번호에 따라 DB에서 게시물 삭제
    db.collection('post').deleteOne(req.body, function(error, result){
        console.log('Delete Success!');
        res.status(200).send({message : "Success!"}); //성공 판정 요청
    });
});

app.get('/detail/:id', function(req, res){
    db.collection('post').findOne({_id: parseInt(req.params.id)}, function(error, result){
        console.log(result)
        res.render('detail.ejs', {data: result});
    });
})



