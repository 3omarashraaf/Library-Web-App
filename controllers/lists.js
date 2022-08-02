const fetchBooks = require('../utils/fetchBooks');
const Book = require('../models/book')
const List = require('../models/list')
const User = require('../models/user')
const mongoose = require('mongoose');


module.exports.newList = async (req,res) =>{
    const {name,coverUrl} = req.body.list
    const id = req.session.user.user_id
    const user = await User.findById(id)
    const list = new List({name,coverUrl,owner: id})
    await list.save()
    user.lists.push(list)
    await user.save()
    req.session.user.lists.push({name: list.name,id: list.id})
    res.redirect(`/${user.username}`)
}
module.exports.showList = async (req,res) =>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        req.flash('error','Sorry we cannot find this list')
        return res.redirect('/')
    }
    const list = await List.findById(req.params.id).populate('books')
    if (!list){
        req.flash('error','Sorry we cannot find this list')
        return res.redirect('/')
    }
    res.render('profile/showList',{list,username:req.params.username})
}
module.exports.showEditList = async (req,res) =>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        req.flash('error','Sorry we cannot find this list')
        return res.redirect('/')
    }
    const list = await List.findById(req.params.id)
    if (!list){
        req.flash('error','Sorry we cannot find this list')
        return res.redirect('/')
    }
    res.render('profile/editList',{list})
}
module.exports.editList = async (req,res) =>{
    await List.findByIdAndUpdate(req.params.id, { ...req.body.list });
    res.redirect(`/${req.session.user.username}`)
}

module.exports.addToList = async (req,res) => {
    let listId = req.body.choosenList
    let book = await Book.findOne({isbn: req.body.book.isbn}) 
    if(!book){
        const newBook = new Book(req.body.book);
        await newBook.save();
        book = newBook;
    }
    if(req.body.choosenList === 'new'){
        const name = req.body.list.name
        const user = await User.findById(req.session.user.user_id)
        const list = new List({name,owner: user._id})
        await list.save()
        listId = list._id
        user.lists.push(list)
        await user.save()
        list.books.push(book)
        await list.save()
        req.session.user.lists.push({name: list.name,id: list.id})
    }else{
        const list = await List.findById(listId).populate('books');
        const found = list.books.find(el => el.isbn === book.isbn);
        if(found){
            req.flash('error',`${book.title} is already in ${list.name}`)
            return res.redirect(`/${req.session.user.username}/lists/${list._id}`)
        }
        list.books.push(book)
        await list.save();
    }
    res.redirect(`/${req.session.user.username}/lists/${listId}`)

}
module.exports.removeBook = async (req,res) => {
    const list = await List.findById(req.params.id)
    const book = await Book.findOne({isbn: req.params.isbn})
    list.books.pull({_id: book._id})
    await list.save()
    res.redirect(`/${req.params.username}/lists/${list._id}`)
}
module.exports.deleteList = async (req,res) =>{
    const {username, id} = req.params
    await User.findOneAndUpdate({username},{$pull: {lists: id}});
    await List.findByIdAndDelete(id)
    res.redirect(`/${username}`)
}