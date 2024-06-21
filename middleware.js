const Listing = require('./models/listings')
const ExpressError = require('./utils/expresserror.js')
const {listingSchema,reviewSchema} = require('./schema.js');
const Review  = require('./models/review.js')


module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
 
    if(error) {
       let errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400, errMsg);
    } else{
       next();
    }
 };


module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
       let errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400, errMsg);
    } else {
       next();
    }
 }


module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing");
         return res.redirect("/login")
     }
     next();
};


module.exports.savedRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error", "You are not the owner of the listing");
      return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.isAuthor = async(req,res,next) =>{
    let {id, reviewid} = req.params;
    let review  = await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error", "You are noy the author of this listing");
      return res.redirect(`/listings/${id}`);
    }
    next();
};