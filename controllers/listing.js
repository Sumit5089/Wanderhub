const Listing = require('../models/listings')

module.exports.index = async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("./listings/index", {allListings});
 };

 module.exports.renderNewForm =  (req,res) =>{
    res.render("./listings/new");
 }

 module.exports.showListing = async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({
      path: "reviews",
      populate:{
        path: "author",
      },
    }).populate("owner");
    if(!listing) {
      req.flash("error", "Listing you requested does not exist!")
      res.redirect("/listings")
    }
    res.render("./listings/show", {listing});
 }


 module.exports.createListing = async(req,res,next) =>{
    const newlisting =  new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "New Listing created!")
    res.redirect("/listings")
  }


  module.exports.editListing = async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
      req.flash("error", "Listing you requested does not exist!")
      res.redirect("/listings")
    }
    res.render("./listings/edit", {listing});
 }

 module.exports.updateListing = async(req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`);
 }

 module.exports.destroyListing = async(req,res) =>{
    let {id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted")
    res.redirect(`/listings`);
 }