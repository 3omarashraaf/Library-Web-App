module.exports.isNotLoggedIn = (req, res, next)=> {
    if(!req.session.user_id){
        req.session.returnTo = req.originalUrl 
        req.flash('error','You must be logged in to do that')
        res.redirect('/login')
    }
    next();
}

module.exports.isLoggedIn = (req, res, next)=> {
    if(req.session.user_id){
        req.flash('error','You are already logged in')
        res.redirect('/')
    }
    next();
}