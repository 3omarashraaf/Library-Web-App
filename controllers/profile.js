const bcrypt = require('bcrypt');
const User = require('../models/user');
const multer = require('multer')
const _ = require('underscore');
const {storage} = require('../cloudinary');
const List = require('../models/list');
const Book = require('../models/book');
const upload = multer({storage})


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
                tvshowLists: user.tvshowLists.map(el=>  ({type: el.type,name: el.name,id:el._id})),
                followers: user.followers,
                following: user.following,
                likesLists: user.likedLists.map(el=>  ({type: el.type,name: el.name,id:el._id}))
            }
            const redirectUrl = req.session.returnTo || '/home'
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
        bookLists: user.bookLists.map(el=>  ({type: el.type,name: el.name,id:el._id,privacy:el.privacy})),
        movieLists: user.movieLists.map(el=>  ({type: el.type,name: el.name,id:el._id,privacy:el.privacy})),
        tvshowLists: user.tvshowLists.map(el=>  ({type: el.type,name: el.name,id:el._id,privacy:el.privacy})),
        followers: user.followers,
        following: user.following,
        likedLists: user.likedLists.map(el=>  ({type: el.type,name: el.name,id:el._id,privacy:el.privacy}))
    }
    res.redirect('/home')
}
module.exports.showProfile = async (req,res) => {
    const user = await User.findOne({username: req.params.username})
                                .populate('bookLists')
                                .populate('movieLists')
                                .populate('tvshowLists')
                                .populate({path:"likedLists",populate:{
                                    path: 'owner'
                                }})
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
    user.pfpUrl = req.file.path
    if(user.password !== user.confPassword){
        req.flash('error',`The passwords doesn't match`)
        return res.redirect(`/${username}/edit`)
    }else{
        delete user.confPassword
        const password = await bcrypt.hash(user.password,12)
        user.password = password
        await User.findOneAndUpdate({username: username },user)
        res.redirect(`/${username}`)
    }
    
}

module.exports.follow=async(req,res) => {
    const followedUser = await User.findOne({username: req.params.username})
    const currentUser = await User.findById(req.session.user.user_id) 
    followedUser.followers.push(currentUser)
    currentUser.following.push(followedUser)
    await followedUser.save()
    await currentUser.save()
    req.session.user.following.push(followedUser._id)
    res.redirect(`/${followedUser.username}`)
} 
module.exports.unfollow=async(req,res) => {
    const followedUser = await User.findOne({username: req.params.username})
    const currentUser = await User.findById(req.session.user.user_id) 
    followedUser.followers.pull(currentUser)
    currentUser.following.pull(followedUser)
    await followedUser.save()
    await currentUser.save()
    req.session.user.following = req.session.user.following.filter(item => item !== followedUser._id.toString())
    res.redirect(`/${followedUser.username}`)
} 

module.exports.newsfeed = async(req,res)=>{
    let user = await User.findById(req.session.user.user_id).populate('following')
    let followingLogs = []
    for(let one of user.following){
        for(let log of one.logs){
           let blah ={
            owner:one.username,
            ownerpfp:one.pfpUrl,
            ...log._doc
            }
            if(log.list){
                const {name,type,_id} = await List.findById(log.list)
                blah.list = {name,type,_id}
                if(log.thing){
                    switch (blah.list.type){
                        case "Books": {const {title,_id} = await Book.findById(log.thing);
                                        blah.thing = {title,_id}}
                                        break;
                        case "Movies": {const {title,_id} = await Movie.findById(log.thing);
                                        blah.thing = {title,_id}}
                                        break;
                        case "Tv Shows": {const {title,_id} = await Tvshow.findById(log.thing);
                                        blah.thing = {title,_id}}
                                        break;
    
                    }
                }
            }
            
            followingLogs.push(blah)
        }

    }           
    // console.log(followingLogs[0])
    _.sortBy(followingLogs, 'date');
    res.render('newsfeed',{followingLogs})
}   
module.exports.logout = (req,res) => {
    req.session.destroy();
    res.redirect('/')
}
