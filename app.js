const express = require('express');
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const engine = require('ejs-mate')
const bcrypt = require('bcrypt')
const flash = require('connect-flash');
const router = express.Router();

const { isLoggedIn , isNotLoggedIn} = require('./middleware');


const mongoConnect = require('./utils/mongoConnect')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

const books = require('./routes/books');
const reviews = require('./routes/reviews');
const lists = require('./routes/lists');
const profile = require('./routes/profile');

const User = require('./models/user');
const { Cookie } = require('express-session');

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
app.set('views',path.join(__dirname, 'views/main'))

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
app.use('/:id',profile)
app.use('/:id/lists',lists)


app.get('/',(req,res)=>{                                     // Render Home Page
    res.render('home')
})                                   
app.get('/login', isLoggedIn, (req,res)=>{                               // Render Login Page
    res.render('login')
})              
app.get('/register', isLoggedIn, (req,res)=>{           // Render Register Page 
    res.render('register')
});                          
app.post('/login' , isLoggedIn, catchAsync(async (req,res)=>{             // Submit login form
    const { username, password} = req.body
    const user = await User.findOne({username})
     if (user){
        const validUser = await bcrypt.compare(password, user.password)
        if (validUser){
            req.session.user_id = user._id
            const redirectUrl = req.session.returnTo || '/'
            delete req.session.returnTo 
            return res.redirect(redirectUrl)
        }
    } else{
        req.flash('error','Incorrect username  or password')
        res.redirect('/login')
    }
}));                                         
app.post('/register', isLoggedIn, catchAsync(async (req,res)=>{          // Submit Register form  C
    const { username, password, email} = req.body
    const hash = await bcrypt.hash(password,12)
    const user = new User({
        username,
        email,
        password: hash
    })
    await user.save()
    req.session.user_id = user._id
    res.redirect('/')
}));  
app.get('/logout',isNotLoggedIn,(req,res) => {
    req.session.destroy();
    res.redirect('/')
})

app.get('/secret',isNotLoggedIn,(req,res) => {
    res.redirect('/')
})
                      
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