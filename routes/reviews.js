const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const review = require('../controllers/review');
const {validateReview, allegedUser,allegedReviewOwner,isNotLoggedIn} = require('../utils/middleware');

router.post('/',isNotLoggedIn,validateReview,catchAsync(review.addReview))   // Add a Review     C
router.delete('/:id',isNotLoggedIn,allegedReviewOwner,catchAsync(review.deleteReview))          // Delete a Review  D

module.exports = router;