const {fetchOneMovie} = require('../utils/fetchMovies');
const Book = require('../models/book')
const Movie = require('../models/movie')
const Tvshow = require('../models/tvshow')
const List = require('../models/list')
const User = require('../models/user')
const mongoose = require('mongoose');
const { fetchOneTvshow } = require('../utils/fetchTvshows');
const { listenerCount } = require('../models/book');
const user = require('../models/user');


module.exports.newList = async (req,res) =>{
    const {name,listCover,type,privacy} = req.body.list
    const id = req.session.user.user_id
    const user = await User.findById(id)
    const list = new List({type,name,coverUrl: listCover,owner: id,privacy})
    await list.save()
    switch(type){
        case "Books":  user.bookLists.push(list);
                       req.session.user.bookLists.push({type:'Books',name: list.name,id: list.id})
                       break;
        case "Movies":  user.movieLists.push(list)
                        req.session.user.movieLists.push({type:'Movies',name: list.name,id: list.id})
                        break;

        case "Tv Shows": user.tvshowLists.push(list)
                         req.session.user.tvshowLists.push({type:'Tv Shows',name: list.name,id: list.id})
                         break;


    }
    if(privacy === 'Public'){
        user.logs.push({type:'Create',list:list,date:Date.now()})
    }
    await user.save()
    res.redirect(`/${user.username}`)
}
module.exports.showList = async (req,res) =>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        req.flash('error','Sorry we cannot find this list')
        return res.redirect('/')
    }
    const list = await List.findById(req.params.id).populate('books').populate('movies').populate('tvshows').populate('owner')
    if (!list){
        req.flash('error','Sorry we cannot find this list')
        return res.redirect('/')
    }
    else if((list.privacy === 'Private') && (!req.session.user ||req.session.user.username !== req.params.username)){
        req.flash('error','Sorry this is a private list')
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
    res.redirect(`/${req.session.user.username}/lists/${req.params.id}`)
}
module.exports.likeList = async (req,res) =>{
    let list = await List.findById(req.params.id)
    let user = await User.findById(req.session.user.user_id)
    if(list.likes.includes(req.session.user.user_id)){
        list.likes.pull(req.session.user.user_id)
        user.likedLists.pull(req.params.id)
    }else{
        list.likes.push(req.session.user.user_id)
        user.likedLists.push(req.params.id) 
        
    }
    await list.save()
    await user.save()
    res.redirect(`/${req.params.username}/lists/${list._id}`)
}

module.exports.addBook = async (req,res) => {
    let listId = req.body.choosenList
    const user = await User.findById(req.session.user.user_id)
    let book = await Book.findOne({isbn: req.body.book.isbn}) 
    if(!book){
        const newBook = new Book(req.body.book);
        await newBook.save();
        book = newBook;
    }
    if(req.body.choosenList === 'new'){
        const name = req.body.list.name
        const list = new List({type:"Books",coverUrl:"https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",name,owner: user._id,privacy:"Public"})
        await list.save()
        listId = list._id
        user.bookLists.push(list)
        list.books.push(book)
        await list.save()
        req.session.user.bookLists.push({type: list.type,name: list.name,id: list.id})
    }else{
        const list = await List.findById(listId).populate('books');
        const found = list.books.find(el => el.isbn === book.isbn);
        if(found){
            req.flash('error',`${book.title} is already in ${list.name}`)
            return res.redirect(`/${req.session.user.username}/lists/${list._id}`)
        }
        list.books.push(book)
        if(list.privacy === 'Public'){
            user.logs.push({type:'Add',list:list,date:Date.now(),thing:book})
         }
        await list.save();
    }
    await user.save()
    res.redirect(`/${req.session.user.username}/lists/${listId}`)

}
module.exports.addMovie = async (req,res) => {
    let listId = req.body.choosenList
    let movie = await Movie.findOne({id: req.body.movie.id}) 
    const user = await User.findById(req.session.user.user_id)
    if(!movie){
        const newMovie = await fetchOneMovie(req.body.movie.id)
        const movieObj = new Movie(newMovie)
        await movieObj.save();
        movie = movieObj;
    }
    if(req.body.choosenList === 'new'){
         const name = req.body.list.name
         const list = new List({type:"Movies",coverUrl:"https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",name,owner: user._id,privacy:"Public"})
         await list.save()
         listId = list._id
         user.movieLists.push(list)
         list.movies.push(movie)
         await list.save()
        req.session.user.movieLists.push({type: list.type,name: list.name,id: list.id})
    }else{
         const list = await List.findById(listId).populate('movies');
         const found = list.movies.find(el => el.id === movie.id);
        if(found){
             req.flash('error',`${movie.title} is already in ${list.name}`)
             return res.redirect(`/${req.session.user.username}/lists/${list._id}`)
         }
         list.movies.push(movie)
         if(list.privacy === 'Public'){
            user.logs.push({type:'Add',list:list,date:Date.now(),thing:movie})
         }
         await list.save();
    }
    await user.save()
    res.redirect(`/${req.session.user.username}/lists/${listId}`)

}
module.exports.addTvshow = async (req,res) => {
    let listId = req.body.choosenList
    const user = await User.findById(req.session.user.user_id)
    let tvshow = await Tvshow.findOne({id: req.body.tvshow.id}) 
    if(!tvshow){
        const newTvshow = await fetchOneTvshow(req.body.tvshow.id)
        const tvshowObj = new Tvshow(newTvshow)
        await tvshowObj.save();
        tvshow = tvshowObj;
    }
    if(req.body.choosenList === 'new'){
        const name = req.body.list.name
        const list = new List({type:"Tv Shows",coverUrl:"https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",name,owner: user._id,privacy:"Public"})
        await list.save()
        listId = list._id
        user.tvshowLists.push(list)
        list.tvshows.push(tvshow)
        await list.save()
        req.session.user.tvshowLists.push({type: list.type,name: list.name,id: list.id})
    }else{
        const list = await List.findById(listId).populate('tvshows');
        const found = list.tvshows.find(el => el.id === tvshow.id);
        if(found){
            req.flash('error',`${tvshow.title} is already in ${list.name}`)
            return res.redirect(`/${req.session.user.username}/lists/${list._id}`)
        }
        list.tvshows.push(tvshow)
        if(list.privacy === 'Public'){
           user.logs.push({type:'Add',list:list,date:Date.now(),thing:tvshow})
        }
        await list.save();
    }
    await user.save()
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

module.exports.togglePrivacy = async (req,res) =>{
    const list = await List.findById(req.params.id)
    const user = await User.findById(req.session.user.user_id)
    if (list.privacy === 'Public'){
        list.privacy = 'Private'
    }else{
        list.privacy = 'Public'
        user.logs.push({type:'Change',list:list,date:Date.now()})
        await user.save()
    }
    await list.save()
    res.redirect(`/${req.params.username}/lists/${list._id}`)
}