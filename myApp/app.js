var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var fs = require('fs');
var app = express();
var TWO_HOURS = 1000 * 60 * 60 * 2
var {
    NODE_ENV = 'development',
    SESS_NAME = 'sid',
    SESS_SECRET = 'gjd;jgaklf;jhg',
    SESS_LIFETIME = TWO_HOURS
} = process.env
var IN_PROD = NODE_ENV === 'production'

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
  console.log(req.session.userId)
  if (!req.session.userId){
      res.redirect('/')
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
  res.render('start', {uid: userId})
});
app.get('/login', redirectHome,(req,res) => {
  res.render('login');
});
app.get('/registration', redirectHome,(req,res) => {
  res.render('registration');
});
app.get('/home',(req,res) => {
  console.log(req.session)
  res.render('home');
});
app.get('/novel', redirectLogin,(req,res) => {
  console.log(req.session.userId)
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
  const {userId} = req.session
  fs.readFile('users.json', 'utf-8', function(err, data) { 
    if (err) throw err;
    var existingUsers = JSON.parse(data);
    var users = existingUsers
    const user = users.find(
      user => user.id === userId
    )
    res.render('readlist',{title: `${user.books.length} Books found`,result: user.books});
  })
});
app.get('*', function(req, res){
  res.send('404 : Not Found');
});
// POST Requests 
app.post('/register', redirectHome, (req,res)=>{
  const {username,password} = req.body
  if (username&&password){
    fs.readFile('users.json', 'utf-8', function(err, data) { 
      if (err) throw err;
      var existingUsers = JSON.parse(data);
      var users = existingUsers;
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
        res.redirect('/home');
      }else{
        res.redirect('/registration?error=' + encodeURIComponent('Username_already_exists'));

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
          console.log(req.session)
          res.redirect('/home')
        } 
        else{
          res.redirect('/login?error=' + encodeURIComponent('Incorrect_Credential'));
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
      res.redirect('/home')
    }
    res.clearCookie(SESS_NAME)
    res.redirect('/')
  })
});
app.post('/addToList', redirectLogin, (req,res) => { 
  var {userId} = req.session
  var name = req.body.Name;
  fs.readFile('users.json', 'utf-8', function(err, data) { 
    if (err) throw err;
    var existingUsers = JSON.parse(data);
    var users = existingUsers
    const user = users.find(
      user => user.id === userId
    )
    const exists = user.books.some(
      book => book.name === name
    )
    if (!exists){
      fs.readFile('books.json', 'utf-8', function(err, data) { 
        if (err) throw err;
        var existingBooks = JSON.parse(data);
        var books = existingBooks.books;
        const book = books.find(
          book => book.name === name
        )
        user.books.push(book); 
        fs.writeFile('users.json', JSON.stringify(users), 'utf-8', function(err) {
          if (err) throw err
        });
        res.redirect('/home')
      });
    }else{
      res.redirect('/home?error=' + encodeURIComponent('Book_already_in_your_list'));
    }
    });
  
})
 if (process.env.PORT){
    app.listen(process.env.PORT, () => {
      console.log('Server running at Heroku');
    });
 }
 else{
    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000');
    });
 }
