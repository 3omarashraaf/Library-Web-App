var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
const port = 3000;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// GET Requests 
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

// POST Requests 
app.post('/register', function(req,res){
  var userObj = req.body;
  //  Checking on empty entries
  if(!userObj.username || !userObj.password){
      console.log("Username/Password cannot be empty!");
      res.render('registration');
  }  
  else{
      //  Reading from the JSON DB
      fs.readFile('users.json', 'utf-8', function(err, data) { 
          if (err) throw err;
          var existingUsers = JSON.parse(data);
          //  Check if the username already exists
          var flag = false; 
          for (let users of existingUsers.users) {
            if(users.username == userObj.username){
                console.log('Username already exists');
                res.render('registration');
                flag = true;
                break;
            }
        }
      //  Writing data back to the DB  
          if(!flag){
              existingUsers.users.push(userObj);  
              fs.writeFile('users.json', JSON.stringify(existingUsers), 'utf-8', function(err) {
                  if (err) throw err
                  console.log('Done!');
                  return res.redirect('/');
              });
          }     
      });
  }
});

app.post('/login',function(req,res){
  var userLogin = req.body;
  //  Checking on empty entries
  if(!userLogin.username || !userLogin.password){
      console.log("Username/Password cannot be empty!");
      res.render('login');
  }  
  else{
      //  Reading from the JSON DB
      fs.readFile('users.json', 'utf-8', function(err, data) { 
        if (err) throw err;
        var existingUsers = JSON.parse(data);
        //  Check if the username  exists
        var nameFlag = false; 
        for (let users of existingUsers.users) {
          if(users.username == userLogin.username){
            console.log('Username Found');  
            nameFlag = true;
            break;
          }
          else{
            console.log('Username Not Found!');
            res.render('login');
            break;
          }
        }
        for (let users of existingUsers.users ){
          if(nameFlag){
            if(users.password == userLogin.password){
              console.log('username & password are CORRECT');
              res.render('home');
              break;
            }
            else{
              console.log('Password is NOT CORRECT');
              res.render('login');
              break;
            }
          }
        }
      });
  }     
});

app.post('/search', function(req,res){
  res.render('searchresults');
});




app.listen(port, function() {
  console.log('Server running at http://localhost:' + port + '/');
});