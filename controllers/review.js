// controllers/reviewController.js

const Review = require('../models/review');
const Listing = require('../models/listings');

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    // Save the new review
    await newReview.save();
    await listing.save();

    // Calculate the new average rating
    const totalReviews = listing.reviews.length;
    const sumRatings = await Review.aggregate([
        { $match: { _id: { $in: listing.reviews } } },
        { $group: { _id: null, total: { $sum: "$rating" } } }
    ]);

    const avgRating = totalReviews > 0 ? sumRatings[0].total / totalReviews : 0;

    // Update listing with new stats
    listing.avgRating = avgRating;
    listing.totalReviews = totalReviews;
    await listing.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);

    let listing = await Listing.findById(id).populate('reviews');

    // Recalculate the average rating after deletion
    const totalReviews = listing.reviews.length;
    const sumRatings = await Review.aggregate([
        { $match: { _id: { $in: listing.reviews } } },
        { $group: { _id: null, total: { $sum: "$rating" } } }
    ]);

    const avgRating = totalReviews > 0 ? sumRatings[0].total / totalReviews : 0;

    listing.avgRating = avgRating;
    listing.totalReviews = totalReviews;
    await listing.save();

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}
