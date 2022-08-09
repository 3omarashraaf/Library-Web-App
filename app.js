//Require Dependences
require('dotenv').config();
const express = require('express');
const path = require('path')
const session = require('express-session')
const engine = require('ejs-mate')
const flash = require('connect-flash');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');

const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/bookshelf'
const secret = process.env.SECRET || 'thisshouldbeabettersecret'
const port = process.env.PORT || 3000
//Require utils
const {isAdmin} = require('./utils/middleware');
const mongoConnect = require('./utils/mongoConnect')
const ExpressError = require('./utils/ExpressError')

//Require Routes
const books = require('./routes/books');
const movies = require('./routes/movies');
const tvshows = require('./routes/tvshows');
const reviews = require('./routes/reviews');
const lists = require('./routes/lists');
const profile = require('./routes/profile');

const store = new MongoStore({
    mongoUrl: dbURL,
    touchAfter: 24*60*60,
    secret
})
const sessionConfig ={
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:  1000 * 60 * 60 * 24 * 7
    }
}

const app = express();
const db = mongoConnect();


app.engine('ejs',engine)
app.set('view engine','ejs')
app.set('views',path.join(__dirname, 'views'))

app.use(session(sessionConfig))
app.use(flash())
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

app.use((req,res,next)=>{
    res.locals.currentUser = null || req.session.user;
    res.locals.success = null || req.flash('success');
    res.locals.error = null || req.flash('error');
    next();
})

app.get('/admin',isAdmin,(req,res) => {
    res.render('admin')
})
app.use('/books',books)
app.use('/tvshows',tvshows)
app.use('/movies',movies)
app.use('/books/:isbn/reviews',reviews)
app.use('/',lists)
app.use('/',profile)


app.all('*',(req,res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
   // Mongo Duplicate Keys errors  in Registering 
    if(err.code && err.code === 11000 ){
        if(err.keyPattern.username){
            req.flash('error',`This username "${err.keyValue.username}" is already used`)
            res.redirect('/register')
        } else if (err.keyPattern.email){
            req.flash('error',`This email is already used`)
            return res.redirect('/register')
        }
    }

    res.status(statusCode).render('error', { err })
})

app.listen(port,() =>{
    console.log(`Server is up on Port ${port}`)
})