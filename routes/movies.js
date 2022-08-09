const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const movies = require('../controllers/movies');
const {validateMovie,isNotLoggedIn, isAdmin} = require('../utils/middleware');


router.get('/',movies.index)                                                 // INDEX   R             
router.get('/TMDB',isNotLoggedIn,catchAsync(movies.search))                                // Search Books 
//router.get('/new',isNotLoggedIn,isAdmin,(req,res) =>{res.render('movies/new')})            // Render New Book Form 
//router.post('/', validateMovie,isNotLoggedIn,isAdmin ,catchAsync(movies.createMovie))      // Create a movie    C
//router.get('/:id/edit',isNotLoggedIn,isAdmin, catchAsync(movies.showEditPage))             // Render edit movie Form   
//router.put('/:id', validateMovie, isAdmin,isNotLoggedIn,catchAsync(movies.editMovie))      // Edit a movie      U
//router.delete('/:id',isAdmin,isNotLoggedIn,catchAsync(movies.deleteBook))                  // Delete a Movie    D
router.get('/:id',catchAsync(movies.showOneMovie))                                         // Show one Movie

module.exports = router;
