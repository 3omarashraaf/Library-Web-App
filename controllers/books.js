const fetchBooks = require('../utils/fetchBooks');
const Book = require('../models/book');

module.exports.showAll = async(req,res) => {
    const books = await Book.find({})
    res.render('books/index',{books})
}

module.exports.search = async(req,res) => { 
    const books = await fetchBooks(req.body.searchKey)
    res.render('books/searchResult',{books})
}

module.exports.addOneBook = async(req,res) => {
    const id = req.params.id;
    const bookArray = await fetchBooks(id)
    delete req.params.id
    const book = new Book(bookArray[0])
    await book.save();
    res.redirect(`/books/${book.isbn}`)
} 

module.exports.newBook = async(req,res) => {
    const book = new Book(req.body.book);
    await book.save();
    res.redirect(`/books/${book.isbn}`)
}

module.exports.showOneBook = async(req,res) => {
    const book = await Book.findOne({isbn: req.params.isbn}).populate({path:'reviews',populate:{path:'user'}})
    res.render('books/show', { book });
}

module.exports.showEditPage = async (req, res) => {
    const book = await Book.findOne({isbn: req.params.isbn})
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
