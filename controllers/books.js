const fetchBooks = require('../utils/fetchBooks');
const Book = require('../models/book');
const User = require('../models/user');

module.exports.showAll = async(req,res) => {
    const books = await Book.find({})
    res.render('books/index',{books})
}

module.exports.search = async(req,res) => { 
    const books = await fetchBooks(req.query.searchKey)
    res.render('books/searchResult',{books})
}

module.exports.newBook = async(req,res) => {
    const book = new Book(req.body.book);
    await book.save();
    res.redirect(`/books/${book.isbn}`)
}

module.exports.showOneBook = async(req,res) => {
    const book = await Book.findOne({isbn: req.params.isbn}).populate({path:'reviews',populate:{path:'user'}})
    if(!book){
        req.flash('error',`Sorry we don't have that book`)
        res.redirect('/books')
    }
    res.render('books/show', { book });
}

module.exports.showEditPage = async (req, res) => {
    const book = await Book.findOne({isbn: req.params.isbn})
    if(!book){
        req.flash('error','Sorry cannot find this book')
        res.redirect('/books')
    }
    res.render('books/edit', { book });
}

module.exports.editBook = async (req, res) => {
    const { isbn } = req.params;
    const book = await Book.findOneAndUpdate({isbn}, { ...req.body.book });
    res.redirect(`/books/${req.body.book.isbn}`)
}

module.exports.deleteBook = async (req, res) => {
    const { isbn } = req.params;
    const book = await Book.findOneAndDelete({isbn});
    res.redirect(`/books`)
}
