const Review = require('../models/review');
const {bookSchema,moiveSchema,tvshowSchema,reviewSchema ,userRegSchema, userLoginSchema} = require('../utils/schemas.js');
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
module.exports.validateMovie = (req, res, next) => {
    const { error } = movieSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
module.exports.validateTvshow = (req, res, next) => {
    const { error } = tvshowSchema.validate(req.body);
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
module.exports.duplicateKeys = (err, req, res, next) => {
    if(err.code === 11000 ){
        if(err.keyPattern.username){
            req.flash('error',`This username "${err.keyValue.username}" is already used`)
            return res.redirect('/register')
        } else if (err.keyPattern.email){
            req.flash('error',`This email is already used`)
            return res.redirect('/register')
        }
    }
    next();
}
module.exports.allegedReviewOwner = async (req,res,next)=>{
    const review = await Review.findById(req.params.reviewID).populate('user')
    if(review.user.username !== req.session.user.username){
        req.flash('error','You are not allowed to do do that')
        return res.redirect(`/`)
    }
    next();
}
module.exports.allegedUser = (req,res,next)=>{
    if(req.params.username !== req.session.user.username){
        req.flash('error','You are not allowed to do do that')
        return res.redirect(`/`)
    }
    next();
}
module.exports.isAdmin = (req,res,next) => {
    if(req.session.user.username !== 'admin'){
        req.flash('error','Sorry, You are not authorized to do that ')
        res.redirect('/')
    }
    next();
}
module.exports.isNotLoggedIn = (req, res, next)=> {
    if(!req.session.user){
        req.session.returnTo = req.originalUrl 
        req.flash('error','You must be logged in to do that')
        res.redirect('/login')
    }
    next();
}

module.exports.isLoggedIn = (req, res, next)=> {
    if(req.session.user){
        req.flash('error','You are already logged in')
        res.redirect('/')
    }
    next();
}