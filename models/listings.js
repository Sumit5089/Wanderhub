//listing model
const mongoose = require('mongoose');
const Review = require('./review.js');

const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    image:  {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    type: String,
    reviews: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref:"User",
    },
    avgRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
});

listingSchema.post("findOneAndDelete", async (listing) =>{
    if (listing){
        await Review.deleteMany({_id : {$in: listing.reviews}})
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
