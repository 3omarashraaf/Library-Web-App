const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const profile = require('../controllers/profile');
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})

const { isLoggedIn , isNotLoggedIn,validateUserReg,validateUserLogin, allegedUser, duplicateKeys} = require('../utils/middleware');

router.get('/', (req,res)=>{res.render('home')})                                   
router.get('/login', isLoggedIn, (req,res)=>{res.render('login')})              
router.get('/register', isLoggedIn, (req,res)=>{res.render('register')});  
router.get('/home',isNotLoggedIn,catchAsync(profile.newsfeed))
router.post('/login' , isLoggedIn, validateUserLogin,catchAsync(profile.login));                                         
router.post('/register', isLoggedIn, validateUserReg, duplicateKeys,catchAsync(profile.register));  
router.get('/logout', isNotLoggedIn, profile.logout);

router.get('/:username',catchAsync(profile.showProfile));                                  // Render User Profile  
router.get('/:username/follow',catchAsync(profile.follow));                                 
router.get('/:username/unfollow',catchAsync(profile.unfollow));                             

router.get('/:username/edit',isNotLoggedIn,allegedUser,catchAsync(profile.showEditPage))
router.post('/:username',upload.single('pfp'),isNotLoggedIn,allegedUser,catchAsync(profile.editProfile));       // Edit user profile    //todo: put not post 
router.delete('/:username');                                                               // Delete user profile


module.exports = router;