const express = require('express');
const router = express.Router({mergeParams: true}); 
const wrapAsync = require('../utils/wrapasync.js');
const Review  = require('../models/review.js');
const Listing = require('../models/listings.js');
const {validateReview, isLoggedIn} = require('../middleware.js');


//post Reviews
router.post("/", isLoggedIn, validateReview,wrapAsync(async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
 
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
 
 }));
 
 //review delete
 router.delete("/:reviewid", isLoggedIn,wrapAsync(async (req,res) => {
    let {id, reviewid} = req.params;
    updatereview = await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewid}});
    deletereview = await Review.findByIdAndDelete(reviewid);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
 }));

 module.exports = router;