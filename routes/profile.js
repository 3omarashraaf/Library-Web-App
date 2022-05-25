const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const profile = require('../controllers/profile');
const { isLoggedIn , isNotLoggedIn,validateUserReg,validateUserLogin, allegedUser} = require('../utils/middleware');

router.get('/', (req,res)=>{res.render('home')})                                   
router.get('/login', isLoggedIn, (req,res)=>{res.render('login')})              
router.get('/register', isLoggedIn, (req,res)=>{res.render('register')});  

router.post('/login' , isLoggedIn, validateUserLogin,catchAsync(profile.login));                                         
router.post('/register', isLoggedIn, validateUserReg, catchAsync(profile.register));  
router.get('/logout', isNotLoggedIn, profile.logout);

router.get('/:username',isNotLoggedIn,catchAsync(profile.showProfile));                // Render User Profile   R
router.get('/:username/edit',allegedUser,catchAsync(profile.showEditPage))
router.post('/:username',isNotLoggedIn,allegedUser,catchAsync(profile.editProfile));   // Edit user profile     U
router.delete('/:username');                                                           // Delete user profile?  D


module.exports = router;