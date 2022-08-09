const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const tvshows = require('../controllers/tvshows');
const {validateTvshow,isNotLoggedIn, isAdmin} = require('../utils/middleware');


router.get('/',catchAsync(tvshows.index))                                                   // INDEX   R     
router.get('/TMDB',isNotLoggedIn,catchAsync(tvshows.search))                                // Search Books 
router.get('/:id',catchAsync(tvshows.showOneTvshow))                                        // Show one Tvshow
//router.get('/new',isNotLoggedIn,isAdmin,(req,res) =>{res.render('tvshows/new')})            // Render New Book Form 
//router.post('/', validateTvshow,isNotLoggedIn,isAdmin ,catchAsync(tvshows.createTvshow))    // Create a Tvshow    C
//router.get('/:id/edit',isNotLoggedIn,isAdmin, catchAsync(tvshows.showEditPage))             // Render edit Tvshow Form   
//router.put('/:id', validateTvshow, isAdmin,isNotLoggedIn,catchAsync(tvshows.editTvshow))    // Edit a Tvshow      U
//router.delete('/:id',isAdmin,isNotLoggedIn,catchAsync(tvshows.deleteBook))                  // Delete a Tvshow    D

module.exports = router;
