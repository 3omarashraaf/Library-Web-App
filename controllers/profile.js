const bcrypt = require('bcrypt');
const User = require('../models/user');
const List = require('../models/list');

module.exports.login = async (req,res)=>{             // Submit login form
    const { username, password} = req.body.user
    const user = await User.findOne({username}).populate('lists')
     if (user){
        const validUser = await bcrypt.compare(password, user.password)
        if (validUser){
            req.session.user = {
                username: user.username,
                user_id : user._id,
                lists: user.lists.map(el=>  ({name: el.name,id:el._id}))
            }
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
    const list = new List({name:'Fav',owner: user._id})
    user.lists.push(list)
    await user.save()
    await list.save()
    res.redirect('/')
}
module.exports.showProfile = async (req,res) => {
    const user = await User.findOne({username: req.params.username}).populate('lists')
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