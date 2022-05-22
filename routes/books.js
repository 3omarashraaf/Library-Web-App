const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

router.post('/')                             // Add a book       C
router.get('/',catchAsync(async (req,res) =>{     // Show all books   R
    res.render('books')
}))                              
router.post('/:id')                         // Edit a book      U
router.delete('/:id')                       // Delete a book    D
router.get('/:id')                          // Show one book

module.exports = router;
