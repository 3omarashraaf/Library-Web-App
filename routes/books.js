const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const books = require('../controllers/books');

router.post('/')                                                            // Create a book    C
router.get('/',async (req,res) =>{res.render('books')})                     // Show all books   R             
router.post('/search',catchAsync(books.search))                             // Search Books 
router.post('/:id')                                                         // Edit a book      U
router.delete('/:id')                                                       // Delete a book    D
router.get('/:id')                                                          // Show one book

module.exports = router;
