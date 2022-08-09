const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const lists = require('../controllers/lists');
const {allegedUser, isNotLoggedIn} = require('../utils/middleware');

router.get('/:username/lists/new',isNotLoggedIn,allegedUser,(req,res)=>{res.render('profile/newList')})    // New List Form
router.post('/:username/lists/books/add',isNotLoggedIn,allegedUser,catchAsync(lists.addBook))            // Add book To a list 
router.post('/:username/lists/movies/add',isNotLoggedIn,allegedUser,catchAsync(lists.addMovie))            // Add book To a list 
router.post('/:username/lists/tvshows/add',isNotLoggedIn,allegedUser,catchAsync(lists.addTvshow))            // Add book To a list 
router.post('/:username/lists',isNotLoggedIn,allegedUser,catchAsync(lists.newList))                        // Create a new list         C
router.get('/:username/lists/:id',catchAsync(lists.showList))                                              // Open a list               R
router.delete('/:username/lists/:id/books/:isbn',isNotLoggedIn,allegedUser,catchAsync(lists.removeBook))   // Remove a Book from a list U
router.get('/:username/lists/:id/edit',isNotLoggedIn,allegedUser,catchAsync(lists.showEditList))           // Edit List Form           
router.post('/:username/lists/:id',isNotLoggedIn,allegedUser,catchAsync(lists.editList))                   // Edit List                 U   
router.delete('/:username/lists/:id',isNotLoggedIn,allegedUser,catchAsync(lists.deleteList))               // Delete a list             D

module.exports = router;