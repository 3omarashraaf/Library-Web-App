const User = require('../models/user');
const bcrypt = require('bcrypt')

module.exports.login = async (req,res)=>{             // Submit login form
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
}

module.exports.register = async (req,res)=>{          // Submit Register form  C
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
}

module.exports.logout = (req,res) => {
    req.session.destroy();
    res.redirect('/')
}