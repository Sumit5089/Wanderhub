const mongoose = require('mongoose');
const Review = require('./review.js')

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type:String,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
    },
    location: {
        type:String,
    },
    country: {
        type:String,
    },
    reviews:[
        {
            type:mongoose.SchemaTypes.ObjectId,
            ref:"Review",
        },
    ],
});

listingSchema.post("findOneAndDelete", async (listing) =>{
    if (listing){
        await Review.deleteMany({_id : {$in: listing.reviews}})
    }
    
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;