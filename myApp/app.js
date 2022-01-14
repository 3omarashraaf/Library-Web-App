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
app.set('trust proxy', 1); //Comment/Uncomment this line to run Locally/On Heroku
app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie: {
      maxAge: SESS_LIFETIME,
      sameSite: true,
      secure: true// 'true' to run on Heroku 'IN_PROD' to run locally
  }
}))

//Check if there is a logged in user to limit access to pages
const redirectLogin = (req, res, next) =>{
  if (!req.session.userId){
      res.redirect('/')
  }else{
      next()
  }
}
//Check if there is a logged in user redirect to home page if yes
const redirectHome = (req, res, next) =>{
  if (req.session.userId){
      res.redirect('/home')
  }else{
      next()
  }
}
//Access user from res.locals 
app.use((req, res, next) => {
  const{userId} = req.session
  fs.readFile('users.json', 'utf-8', function(err, data) { 
    if (err) throw err;
    var users = JSON.parse(data);
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
  //sending userId to frontend to show components based on if the user is logged in or not  
  res.render('start', {uid: userId})
});
app.get('/login', redirectHome,(req,res) => {
  //sending empty error msg to frontend 
  res.render('login',{msg :''});
});
app.get('/registration', redirectHome,(req,res) => {
    //sending empty error msg to frontend 
  res.render('registration', {msg: ''});
});
app.get('/home', redirectLogin,(req,res) => {
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
app.get('/readlist', redirectLogin, (req,res) => {
  const {userId} = req.session
  fs.readFile('users.json', 'utf-8', function(err, data) { 
    if (err) throw err;
    var users = JSON.parse(data);
    const user = users.find(
      user => user.id === userId
    )
    //sending user's saved books to the frontend to be displayed
    res.render('readlist',{title: `${user.books.length} Books found`,result: user.books, msg:''});
  })
});
app.get('*', function(req, res){
  res.send('404 : Not Found');
});
// POST Requests 
app.post('/register', redirectHome, (req,res)=>{
  //getting username & password from request (user inputs)
  const {username,password} = req.body
  if (username&&password){
    fs.readFile('users.json', 'utf-8', function(err, data) { 
      if (err) throw err;
      var users = JSON.parse(data);
      //Checking if username is already used
      const exists = users.some(
        user => user.username === username
      )
      if (!exists){
        //creating new user object
        const newUser = {
          id: users.length + 1,
          username,
          password,
          books: []
        }
        //adding new user to JSON file
        users.push(newUser);  
        fs.writeFileSync('users.json', JSON.stringify(users), 'utf-8', function(err) {
          if (err) throw err
        });
        //Setting up session id to match the userId
        req.session.userId = newUser.id;
        res.redirect('/home');
      }else{
        //Sending error msg to the frontend if the entered username is already used  
        res.render('registration', {msg: 'Username is already used'});

      }
    })
  }  

})
app.post('/login', redirectHome, (req,res)=>{
  //getting username & password from request (user inputs)
  const {username,password} = req.body
  if (username&&password){
    fs.readFile('users.json', 'utf-8', function(err, data) { 
        if (err) throw err;
        var users = JSON.parse(data);
        //Checking if input credentials are in the JSON file
        const user = users.find(
          user => user.username === username && user.password === password
        )  
        if (user){
          //Setting up session id to match the userId
          req.session.userId = user.id
          res.redirect('/home')
        } 
        else{
          //Sending error msg to the frontend if the entered username or password is not matching the JSON file
          res.render('login', {msg : 'Incorrect Credential'});
        }
    }) 
  } 
})
app.post('/search', redirectLogin, (req,res) => {
  //Getting user's search input from request
  var userSearch =req.body.Search;
  fs.readFile('books.json', 'utf-8', function(err, data) { 
    if (err) throw err;
    var existingBooks = JSON.parse(data);
    var resultBooks = [];
    for (var book of existingBooks.books) {
      var name =JSON.stringify(book.name);
      //checking if user's search input is a substring of any of the existing books 
      if (name.toLowerCase().includes(userSearch.toLowerCase())){
        //adding the matched results into resultBooks
         resultBooks.push(book);
      }
    }  
      //If no books found --> '0 books found' + empty array
      //if any books found --> 'No. books found' + resultBooks array
      res.render('searchresults',{title: `${resultBooks.length} Books found`,result: resultBooks});
  });     
});
app.post('/addToList', redirectLogin, (req,res) => { 
  // Getting active user's session id
  var {userId} = req.session
  //Getting the name of the choosed book
  var name = req.body.Name;
  fs.readFile('users.json', 'utf-8', function(err, data) { 
    if (err) throw err;
    var users = JSON.parse(data);
    //Getting active user's data from JSON file
    const user = users.find(
      user => user.id === userId
    )
    //Checking if the choosed book is already in the user's list
    const exists = user.books.some(
      book => book.name === name
    )
    if (!exists){
      fs.readFile('books.json', 'utf-8', function(err, data) { 
        if (err) throw err;
        var existingBooks = JSON.parse(data);
        var books = existingBooks.books;
        //Getting all the data related to the choosen book from Books.JSON
        const book = books.find(
          book => book.name === name
        )
        //Adding all the data related to the choosen book to the user's List
        user.books.push(book); 
        fs.writeFile('users.json', JSON.stringify(users), 'utf-8', function(err) {
          if (err) throw err
        });
        res.redirect('/readlist')
      });
    }else{
      //Sending error msg to frontend if book is already in user's list
      res.render('readlist',{title: `${user.books.length} Books found`,result: user.books, msg:'This book already in your list'});
    }
    });
  
});
app.post('/removeFromList',  redirectLogin, (req,res) => {
  // Getting active user's session id
  var {userId} = req.session
  //Getting the name of the book to be removed
  var name = req.body.Name;
  fs.readFile('users.json', 'utf-8', function(err, data) { 
    if (err) throw err;
    var users = JSON.parse(data);
    for(user of users){
      if (user.id === userId){
        var tempArr = [];
        // loop through the user's books check for books different than the one to be removed
        for(book of user.books){
          if(book.name !== name){
            tempArr.push(book);
          }
        } 
        //changing the array of books 
        user.books = tempArr;
      }
    }
    //pushing the data back to the JSON file
    fs.writeFile('users.json', JSON.stringify(users), 'utf-8', function(err) {
      if (err) throw err
    });
    res.redirect('/readlist');
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

//Starting the server
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
