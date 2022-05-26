const fetchBooks = require('../utils/fetchBooks');
const Book = require('../models/book')
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
    const list = await List.findById(req.params.id).populate('books')
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
module.exports.addBook1 = async (req,res) => {
    let name = req.body.choosenList
    const bookArray = await fetchBooks(req.body.book.isbn)
    const user = await User.findById(req.session.user_id)
    const book = new Book(bookArray[0])
    await book.save()
    if(req.body.choosenList === 'new'){
        name = req.body.list.name
        const list = new List({name,owner: user._id})
        await list.save()
        listId = list._id
        user.lists.push(list)
        await user.save()
        list.books.push(book)
        await list.save()

    }else{
        const list = await List.findOne({name})
        list.books.push(book)
        await list.save()
    }
    res.redirect(`/${user.username}/lists/${list._id}`)
}
module.exports.addBook2 = async (req,res) => {
    const book = await Book.findById(req.body.book.isbn)
    const list = await List.findById(req.body.choosenList)
    list.books.push(book)
    await list.save();
    res.redirect(`/${req.session.user.username}/lists/${list._id}`)
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