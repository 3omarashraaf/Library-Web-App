const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const lists = require('../controllers/lists');
const {allegedUser, isNotLoggedIn} = require('../utils/middleware');

router.get('/:username/lists/new',isNotLoggedIn,allegedUser,(req,res)=>{res.render('profile/newList')})
router.post('/:username/lists',isNotLoggedIn,allegedUser,catchAsync(lists.newList))              // Create a new list    C
router.get('/:username/lists/:id',catchAsync(lists.showList))                         // Open a list  R
router.get('/:username/lists/:id/edit',isNotLoggedIn,allegedUser,catchAsync(lists.showEditList))                      
router.post('/:username/lists/:id',isNotLoggedIn,allegedUser,catchAsync(lists.editList))                      
router.delete('/:username/lists/:id',isNotLoggedIn,allegedUser,catchAsync(lists.deleteList))                // Delete a list        D

module.exports = router;