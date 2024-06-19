const express = require('express')
const router = express.Router({mergeParams: true}); 
const wrapAsync = require('../utils/wrapasync.js')
const ExpressError = require('../utils/expresserror.js')
const { reviewSchema} = require('../schema.js');
const Review  = require('../models/review.js');
const Listing = require("../models/listings.js");


const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
 
    if(error) {
       let errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400, errMsg);
    } else{
       next();
    }
 };

  //post Reviews

router.post("/",validateReview,wrapAsync(async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
 
    listing.reviews.push(newReview);
 
    await newReview.save();
    await listing.save();
 
    res.redirect(`/listings/${listing._id}`)
 
 }));
 
 //review delete
 
 router.delete("/:reviewid", wrapAsync(async (req,res) => {
    let {id, reviewid} = req.params;
    updatereview = await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewid}});
    deletereview = await Review.findByIdAndDelete(reviewid);
    res.redirect(`/listings/${id}`);
 }))

 module.exports = router;