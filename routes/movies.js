const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const movies = require('../controllers/movies');
const {validateReview,allegedReviewOwner ,validateMovie,isNotLoggedIn, isAdmin} = require('../utils/middleware');


router.get('/',movies.index)                                                               // INDEX           
router.get('/TMDB',isNotLoggedIn,catchAsync(movies.search))                                // Search Books 
router.get('/:id',catchAsync(movies.showOneMovie))                                         // Show one Movie
router.post('/:id/reviews',isNotLoggedIn,validateReview,catchAsync(movies.addReview))   // Add a Review     C
router.delete('/:id/reviews/:reviewID',isNotLoggedIn,allegedReviewOwner,catchAsync(movies.deleteReview))          // Delete a Review  D   

module.exports = router;
