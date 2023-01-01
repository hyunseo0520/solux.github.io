var express = require('express');
var jquery = require('jquery');
var app = express();
const bodyParser = require('body-parser');
const { reset } = require('nodemon');
const MongoClient = require('mongodb').MongoClient;
app.use(bodyParser.urlencoded({extended : true}));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
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

// app.get('/search', (req, res)=>{
//     console.log(req.query.value);
//     db.collection('post').find({ $text:{$search: req.query.value}}).toArray((error, result)=>{
//       console.log(result)
//       res.render('search.ejs', {posts: result})
//     });
// });

app.get('/search', (req, res)=>{
    console.log(req.query.value);
    var 검색조건 = [
        {
          $search: {
            index: 'titleSearch',
            text: {
              query: req.query.value,
              path: 'title'  // 제목날짜 둘다 찾고 싶으면 ['제목', '날짜']
            }
          }
        }, 
        { $sort: { _id : 1 } }, //id 순으로 정렬하여 가져옴
        { $limit: 10 }, // 상위 n개만 가져와 주세요
        { $project: { 제목: 1, _id: 0} } //
      ] 
    db.collection('post').aggregate([]).toArray((error, result)=>{
      console.log(result)
      res.render('search.ejs', {posts: result})
    });
});


app.get('/detail/:id', function(req, res){
    db.collection('post').findOne({_id: parseInt(req.params.id)}, function(error, result){
        console.log(result)
        res.render('detail.ejs', {data: result});
    });
});

// 수정 기능
app.get('/edit/:id', function(req, res) {
    //접속한 게시물의 제목, 날짜를 edit.ejs로 보내기
    db.collection('post').findOne({_id: parseInt(req.params.id)}, function(err,result){
    console.log(result);
    res.render('edit.ejs', {post: result})
    });
});

app.put('/edit', function(req, res) {
    // 폼에 담긴 제목/날짜 데이터를 가지고 db.collection에 업데이트
    //updateOne(어떤게시물을수정, 수정값, 콜백함수) : 특정 게시물을 찾아서 update
    db.collection('post').updateOne({_id: parseInt(req.body.id)},{$set: {title: req.body.title, date: req.body.date }},function(error, result){
        console.log("Edit Success!");
        res.redirect('/list');
    })
});


// 회원인증기능
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({secret: "비밀코드", resave: true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', function(req, res){
    res.render('login.ejs');
});

// 아이디 및 비밀번호가 맞으면 로그인 성공페이지로 보내주어야 함.
// local 방식으로 회원인지 인증
app.post('/login', passport.authenticate('local', {
    // 로그인을 실패하면 해당 경로로 이동
    failureRedirect: '/fail'
}), function(req, res){
    res.redirect('/');
});


app.get('/mypage', 로그인여부판단,function(req, res){
    console.log(req.user);
    res.render('mypage.ejs', {user: req.user})
});

function 로그인여부판단(req, res, next){
    if(req.user){
        next()
    } else {
        res.send('로그인을 하지 않으셨습니다.')
    }
}




passport.use(new LocalStrategy({

    usernameField: 'id',
    passwordField: 'password',
    session: true, // session에 저장할 것인지
    passReqToCallback: false,
  }, function (입력한아이디, 입력한비번, done) {
    console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: 입력한아이디 }, function (error, result) {
      if (error) return done(error)
  
      if (!result) return done(null, false, { message: '존재하지 않는 아이디입니다.' })
      if (입력한비번 == result.password) { //입력한 비번과 결과 비밀번호 비교
        return done(null, result)
      } else {
        return done(null, false, { message: '비밀번호가 틀렸습니다.' })
      }
    })
  }));

//id를 이용해서 세션을 저장시키는 코드 (로그인 성공시 사용)
passport.serializeUser(function(user, done) {
    done(null, user.id)
});

//나중에 사용 (마이페이지 접속시 사용)
passport.deserializeUser(function(아이디, done){
    //db에서 위에 있는 user.id로 유저를 찾은 뒤 유저 정보를 사용
    db.collection('login').findOne({id: 아이디}, function(error, result){
        done(null, result)
    });
});

app.post('/register', function (req, res) {
    db.collection('login').insertOne({ id: req.body.id, password: req.body.password }, function (error, result) {
      res.redirect('/')
    });
});

app.post('/add', function(req, res) {
    res.send('전송완료');
    db.collection('counter').findOne({name: "게시물갯수"}, function(error, result){
        console.log(result.totalPost); //총 게시물 갯수
        var totalPostnum = result.totalPost;
        var list_data = {_id: totalPostnum, writer: req.user._id, title:req.body.title , date: req.body.date }
        db.collection('post').insertOne(list_data, function() {
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

    var 삭제할데이터 = {_id: req.body._id, writer: req.user._id}

    //req.body에 담긴 게시물 번호에 따라 DB에서 게시물 삭제
    db.collection('post').deleteOne(req.body, function(error, result){
        console.log('Delete Success!');
        res.status(200).send({message : "Success!"}); //성공 판정 요청
    });
});
