const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const review = require('../controllers/review');
const {validateReview} = require('../utils/middleware');

router.post('/',validateReview,catchAsync(review.addReview))   // Add a Review     C
router.post('/:id',catchAsync(review.editReview))              // Edit a Review    U
router.delete('/:id',catchAsync(review.deleteReview))          // Delete a Review  D

module.exports = router;