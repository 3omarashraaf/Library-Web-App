
var express = require('express');
var path = require('path');
var app = express();
const port = 3000;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){
  res.render('login');
});
app.get('/registration',function(req,res){
  res.render('registration');
});
app.get('/home',function(req,res){
  res.render('home');
});
app.get('/novel',function(req,res){
  res.render('novel');
});
app.get('/flies',function(req,res){
  res.render('flies');
});
app.get('/grapes',function(req,res){
  res.render('grapes');
});
app.get('/poetry',function(req,res){
  res.render('poetry');
});
app.get('/leaves',function(req,res){
  res.render('leaves');
});
app.get('/sun',function(req,res){
  res.render('sun');
});
app.get('/fiction',function(req,res){
  res.render('fiction');
});
app.get('/dune',function(req,res){
  res.render('dune');
});
app.get('/mockingbird',function(req,res){
  res.render('mockingbird');
});
app.get('/readlist',function(req,res){
  res.render('readlist');
});


app.post('/search', function(req,res){
  res.render('searchresults');
});
app.post('/home', function(req,res){
  res.render('home');
});
app.post('/register', function(req,res){
  res.render('home');
});


app.listen(port, function() {
  console.log('Server running at http://localhost:' + port + '/');
});