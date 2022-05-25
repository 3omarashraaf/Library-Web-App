const List = require('../models/list')
const User = require('../models/user')


module.exports.newList = async (req,res) =>{
    const {name,coverUrl} = req.body.list
    const id = req.session.user_id
    const user = await User.findById(id)
    const list = new List({name,coverUrl,owner: id})
    await list.save()
    user.lists.push(list)
    await user.save()

    res.redirect(`/${user.username}`)
}
module.exports.showList = async (req,res) =>{
    const list = await List.findById(req.params.id)
    res.render('profile/showList',{list,username:req.params.username})
}
module.exports.showEditList = async (req,res) =>{
    const list = await List.findById(req.params.id)
    res.render('profile/editList',{list})
}
module.exports.editList = async (req,res) =>{
    await List.findByIdAndUpdate(req.params.id, { ...req.body.list });
    res.redirect(`/${req.session.username}`)
}
module.exports.deleteList = async (req,res) =>{
    const {username, id} = req.params
    await User.findOneAndUpdate({username},{$pull: {lists: id}});
    await List.findByIdAndDelete(id)
    res.redirect(`/${username}`)
}