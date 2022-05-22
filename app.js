//Require Dependences
const express = require('express');
const path = require('path')
const session = require('express-session')
const engine = require('ejs-mate')
const flash = require('connect-flash');
const router = express.Router();

//Require utils
const { isLoggedIn , isNotLoggedIn} = require('./utils/middleware');
const mongoConnect = require('./utils/mongoConnect')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

//Require Routes
const books = require('./routes/books');
const reviews = require('./routes/reviews');
const lists = require('./routes/lists');
const profile = require('./routes/profile');


const sessionConfig ={
    secret: 'thisshouldbeabettersecret',
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
//app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use((req,res,next)=>{
    res.locals.currentUser = req.session.user_id
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})
app.use('/books',books)
app.use('/books/:id/reviews',reviews)
app.use('/',profile)
app.use('/:id/lists',lists)

app.all('*',(req,res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000,() =>{
    console.log(`Server is up on Port 3000`)
})