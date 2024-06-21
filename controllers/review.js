const Review  = require('../models/review');
const Listing = require('../models/listings')


module.exports.createReview = async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
 
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
 }

 module.exports.destroyReview = async (req,res) => {
    let {id, reviewid} = req.params;
    updatereview = await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewid}});
    deletereview = await Review.findByIdAndDelete(reviewid);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
 }