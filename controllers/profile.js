const User = require('../models/user');
const bcrypt = require('bcrypt');
const user = require('../models/user');

module.exports.login = async (req,res)=>{             // Submit login form
    const { username, password} = req.body.user
    const user = await User.findOne({username})
     if (user){
        const validUser = await bcrypt.compare(password, user.password)
        if (validUser){
            req.session.username = user.username
            req.session.user_id = user._id
            const redirectUrl = req.session.returnTo || '/'
            delete req.session.returnTo 
            return res.redirect(redirectUrl)

        } else{
            req.flash('error','Incorrect username  or password')
            res.redirect('/login')
        }
    }else{
            req.flash('error','Incorrect username  or password')
            res.redirect('/login')
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
    req.session.username = user.username
    req.session.user_id = user._id
    res.redirect('/')
}
module.exports.showProfile = async (req,res) => {
    const user = await User.findOne({username: req.params.username})
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