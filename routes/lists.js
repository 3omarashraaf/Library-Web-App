const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

router.post('/')                        // Create a new list    C
router.get('/')                         // Show all user lists  R
router.post('/:id')                    // Edit a list          U        (including adding a book to a list)
router.delete('/:id')                  // Delete a list        D

module.exports = router;