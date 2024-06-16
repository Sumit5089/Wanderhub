const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type:String,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
        required:true,
    },
    location: {
        type:String,
    },
    country: {
        type:String,
    },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;