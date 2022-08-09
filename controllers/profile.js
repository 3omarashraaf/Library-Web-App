const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports.login = async (req,res)=>{             // Submit login form
    const { username, password} = req.body.user
    const user = await User.findOne({username}).populate('bookLists').populate('movieLists').populate('tvshowLists')
     if (user){
        const validUser = await bcrypt.compare(password, user.password)
        if (validUser){
            req.session.user = {
                username: user.username,
                user_id : user._id,
                bookLists: user.bookLists.map(el=>  ({type: el.type,name: el.name,id:el._id})),
                movieLists: user.movieLists.map(el=>  ({type: el.type,name: el.name,id:el._id})),
                tvshowLists: user.tvshowLists.map(el=>  ({type: el.type,name: el.name,id:el._id}))
            }
            const redirectUrl = req.session.returnTo || '/'
            delete req.session.returnTo 
            return res.redirect(redirectUrl)

        } else{
            req.flash('error','Incorrect username  or password')
            return res.redirect('/login')
        }
    }else{
            req.flash('error','Incorrect username  or password')
            return res.redirect('/login')
        }
}

module.exports.register = async (req,res)=>{          // Submit Register form  C
    const { name, username, password, email} = req.body.user
    const hash = await bcrypt.hash(password,12)
    const user = new User({
        name,
        username,
        email,
        password: hash
    })
    await user.save()
    req.session.user = {
        username: user.username,
        user_id : user._id,
        bookLists: user.bookLists.map(el=>  ({type: el.type,name: el.name,id:el._id})),
        movieLists: user.movieLists.map(el=>  ({type: el.type,name: el.name,id:el._id})),
        tvshowLists: user.tvshowLists.map(el=>  ({type: el.type,name: el.name,id:el._id}))
    }
    res.redirect('/')
}
module.exports.showProfile = async (req,res) => {
    const user = await User.findOne({username: req.params.username}).populate('bookLists').populate('movieLists').populate('tvshowLists')
    if(!user){
        req.flash('error',`There's no one with the username "${req.params.username}" `)
        return res.redirect('/')
    }
    res.render('profile/profile',{user})

}
module.exports.showEditPage = async (req,res) => {
    const user = await User.findOne({username: req.params.username})
    res.render('profile/edit',{user})
    }
module.exports.editProfile= async(req,res) => {
    const username = req.params.username
    const user = req.body.user
    const password = await bcrypt.hash(user.password,12)
    user.password = password
    console.log(user)
    await User.findOneAndUpdate({username: username },user)
    res.redirect(`/${username}`)
}
module.exports.logout = (req,res) => {
    req.session.destroy();
    res.redirect('/')
}