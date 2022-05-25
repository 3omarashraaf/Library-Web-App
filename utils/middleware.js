const {bookSchema,reviewSchema ,userRegSchema, userLoginSchema} = require('../utils/schemas.js');
const ExpressError = require('./ExpressError.js')

module.exports.validateBook = (req, res, next) => {
    const { error } = bookSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateUserReg = (req, res, next) => {
    const { error } = userRegSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
module.exports.validateUserLogin = (req, res, next) => {
    const { error } = userLoginSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.allegedUser = (req,res,next)=>{
    if(req.params.username !== req.session.username){
        req.flash('error','You are not allowed to do do that')
        return res.redirect(`/`)
    }
    next();
}
module.exports.isAdmin = (req,res,next) => {
    if(req.session.username !== 'admin'){
        req.flash('error','Sorry, You are not authorized to do that ')
        res.redirect('/')
    }
    next();
}
module.exports.isNotLoggedIn = (req, res, next)=> {
    if(!req.session.username){
        req.session.returnTo = req.originalUrl 
        req.flash('error','You must be logged in to do that')
        res.redirect('/login')
    }
    next();
}

module.exports.isLoggedIn = (req, res, next)=> {
    if(req.session.username){
        req.flash('error','You are already logged in')
        res.redirect('/')
    }
    next();
}