const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

router.post('/')                  // Add a Review     C
router.post('/:id')              // Edit a Review    U
router.delete('/:id')            // Delete a Review  D

module.exports = router;