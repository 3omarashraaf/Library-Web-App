const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

router.get('/')                               // Render User Profile   R
router.post('/')                              // Edit user profile     U
router.delete('/')                            // Delete user profile?  D

module.exports = router;