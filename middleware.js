const Listing = require("./models/listings")

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing");
         return res.redirect("/login")
     }
     next();
};


module.exports.savedRedirectUrl = (req, res, next) =>{
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error", "you dont have permission to edit");
      return res.redirect(`/listings/${id}`);
    }
}