const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const books = require('../controllers/books');
const {validateBook,isNotLoggedIn, isAdmin} = require('../utils/middleware');


router.get('/googleSearch',isNotLoggedIn,catchAsync(books.search))                  // Search Books 
router.get('/',catchAsync(books.showAll))                             // Show all books   R             
router.get('/new',isNotLoggedIn,isAdmin,(req,res) =>{res.render('books/new')})              // Render New Book Form 
router.post('/', validateBook,isNotLoggedIn,isAdmin ,catchAsync(books.newBook))             // Create a book    C
router.post('/googleId/:id',isNotLoggedIn,catchAsync(books.addOneBook))             // Add book from google
router.get('/:isbn',catchAsync(books.showOneBook))                    // Show one book
router.get('/:isbn/edit',isNotLoggedIn,isAdmin, catchAsync(books.showEditPage))             // Render edit book Form   
router.put('/:isbn', validateBook, isAdmin,isNotLoggedIn,catchAsync(books.editBook))        // Edit a book      U
router.delete('/:isbn',isAdmin,isNotLoggedIn,catchAsync(books.deleteBook))                  // Delete a book    D

module.exports = router;

