var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var fs = require('fs');
var app = express();
var TWO_HOURS = 1000 * 60 * 60 * 2
var {
    PORT = 3000,
    NODE_ENV = 'development',
    SESS_NAME = 'sid',
    SESS_SECRET = 'gjd;jgaklf;jhg',
    SESS_LIFETIME = TWO_HOURS
} = process.env
var IN_PROD = NODE_ENV === 'production'
// var users = [
//     { id: 1, username: '3omarashraaf', password:  '12345678',books: []},
//     { id: 1, username: 'ibraaa33', password:  '12345678',books: []}
// ]

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie: {
      maxAge: SESS_LIFETIME,
      sameSite: true,
      secure: IN_PROD
  }
}))

const redirectLogin = (req, res, next) =>{
  if (!req.session.userId){
      res.redirect('/login')
  }else{
      next()
  }
}
const redirectHome = (req, res, next) =>{
  if (req.session.userId){
      res.redirect('/home')
  }else{
      next()
  }
}
app.use((req, res, next) => {
  const{userId} = req.session
  fs.readFile('users.json', 'utf-8', function(err, data) { 
    if (err) throw err;
    var existingUsers = JSON.parse(data);
    var users = existingUsers
    if (userId) {
      res.locals.user = users.find(
          user => user.id === userId
      )
    }
  })
  next()
})



// GET Requests 
app.get('/', (req, res) => {
  const {userId} = req.session
  res.send(`
    <h1>WELCOME!</h1>
    ${userId ? `
    <a href = "home">Home</a>
    <form method= 'post' action = '/logout'>
        <button>Logout</button>
    </form>
    ` : `
  <a href = "login">Login</a>
  <a href = "registration">Register</a>
  `}
  `)
})
app.get('/login', redirectHome,(req,res) => {
  res.render('login');
});
app.get('/registration', redirectHome,(req,res) => {
  res.render('registration');
});
app.get('/home', redirectLogin,(req,res) => {
  const {userId} = req.session
  console.log(userId);
  res.render('home');
});
app.get('/novel', redirectLogin,(req,res) => {
  res.render('novel');
});
app.get('/flies', redirectLogin,(req,res) => {
  res.render('flies');
});
app.get('/grapes', redirectLogin,(req,res) => {
  res.render('grapes');
});
app.get('/poetry', redirectLogin,(req,res) => {
  res.render('poetry');
});
app.get('/leaves', redirectLogin,(req,res) => {
  res.render('leaves');
});
app.get('/sun', redirectLogin,(req,res) => {
  res.render('sun');
});
app.get('/fiction', redirectLogin,(req,res) => {
  res.render('fiction');
});
app.get('/dune', redirectLogin,(req,res) => {
  res.render('dune');
});
app.get('/mockingbird', redirectLogin,(req,res) => {
  res.render('mockingbird');
});
app.get('/readlist', redirectLogin,(req,res) => {
  res.render('readlist');
});

// POST Requests 

app.post('/register', redirectHome, (req,res)=>{
  const {username,password} = req.body
  if (username&&password){
    fs.readFile('users.json', 'utf-8', function(err, data) { 
      if (err) throw err;
      var existingUsers = JSON.parse(data);
      var users = existingUsers
      const exists = users.some(
        user => user.username === username
      )
      if (!exists){
        const user2 = {
          id: users.length + 1,
          username,
          password,
          books: []
        }
        users.push(user2);  
        fs.writeFileSync('users.json', JSON.stringify(users), 'utf-8', function(err) {
          if (err) throw err
        });
        req.session.userId = user2.id;
        res.redirect('/home')
      }else{
        res.redirect('/registration')
      }
    })
  }  

})

app.post('/login', redirectHome, (req,res)=>{
  const {username,password} = req.body
  if (username&&password){
    fs.readFile('users.json', 'utf-8', function(err, data) { 
        if (err) throw err;
        var existingUsers = JSON.parse(data);
        var users = existingUsers
        const user = users.find(
          user => user.username === username && user.password === password
        )  
        if (user){
          req.session.userId = user.id
          res.redirect('/home')
        } 
        else{
          res.redirect('/login')
        }
    }) 
  } 
})

app.post('/search', redirectLogin, (req,res) => {
  var userSearch =req.body.Search;
  fs.readFile('books.json', 'utf-8', function(err, data) { 
    if (err) throw err;
    var existingBooks = JSON.parse(data);
    var resultBooks = [];
    for (let book of existingBooks.books) {
      let name =JSON.stringify(book.name);
      if (name.toLowerCase().includes(userSearch.toLowerCase())){
         resultBooks.push(book);
      }
    }  
    if(resultBooks.length == 0){
      res.render('searchresults',{title: `${resultBooks.length} Books found`,result: []});
    }
    else{

      res.render('searchresults',{title: `${resultBooks.length} Books found`,result: resultBooks});
    }
  });     
  
});

app.post('/logout', redirectLogin, (req,res) => {
  req.session.destroy(err => {
    if(err){
      return res.redirect('/')
    }

    res.clearCookie(SESS_NAME)
    return res.redirect('/login')
  })
});
app.listen(PORT, function() {
  console.log('Server running at http://localhost:' + PORT + '/');
});