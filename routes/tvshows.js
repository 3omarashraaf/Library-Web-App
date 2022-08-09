const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const tvshows = require('../controllers/tvshows');
const {validateReview,allegedReviewOwner ,validateTvshow,isNotLoggedIn, isAdmin} = require('../utils/middleware');


router.get('/',catchAsync(tvshows.index))                                                   // INDEX  
router.get('/TMDB',isNotLoggedIn,catchAsync(tvshows.search))                                // Search Books 
router.get('/:id',catchAsync(tvshows.showOneTvshow))                                        // Show one Tvshow
router.post('/:id/reviews',isNotLoggedIn,validateReview,catchAsync(tvshows.addReview))   // Add a Review     C
router.delete('/:id/reviews/:reviewID',isNotLoggedIn,allegedReviewOwner,catchAsync(tvshows.deleteReview))          // Delete a Review  D   

module.exports = router;
