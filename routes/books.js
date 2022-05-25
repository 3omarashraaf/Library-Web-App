const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const books = require('../controllers/books');
const {validateBook} = require('../utils/middleware');

router.get('/',catchAsync(books.showAll))                             // Show all books   R             
router.get('/new',(req,res) =>{res.render('books/new')})              // Render New Book Form 
router.post('/', validateBook ,catchAsync(books.newBook))                            // Create a book    C
router.post('/search',catchAsync(books.search))                       // Search Books 
router.post('/googleId/:id',catchAsync(books.addOneBook))             // Add book from google
router.get('/:isbn',catchAsync(books.showOneBook))                        // Show one book
router.get('/:isbn/edit', catchAsync(books.showEditPage))             // Render edit book Form   
router.put('/:isbn', validateBook, catchAsync(books.editBook))                       // Edit a book      U
router.delete('/:isbn',catchAsync(books.deleteBook))                  // Delete a book    D

module.exports = router;
