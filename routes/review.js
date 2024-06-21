const express = require('express');
const router = express.Router({mergeParams: true}); 
const wrapAsync = require('../utils/wrapasync.js');
const Review  = require('../models/review.js');
const Listing = require('../models/listings.js');
const {validateReview, isLoggedIn, isAuthor} = require('../middleware.js');


const reviewController = require('../controllers/review.js') 

//post Reviews
router.post("/", isLoggedIn, validateReview,wrapAsync(reviewController.createReview));
 
 //review delete
 router.delete("/:reviewid", isLoggedIn, isAuthor, wrapAsync(reviewController.destroyReview));

 module.exports = router;