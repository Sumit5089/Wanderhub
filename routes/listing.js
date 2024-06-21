const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapasync.js')
const Listing = require("../models/listings.js");
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js')


//all listings 
router.get("/", wrapAsync(async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("./listings/index", {allListings});
 }));

 // new listing
router.get("/new", isLoggedIn, (req,res) =>{
    res.render("./listings/new");
 });

 //show Route
router.get("/:id" , wrapAsync(async(req,res) =>{
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
 }));


 //create Route

 router.post("/",isLoggedIn, validateListing, wrapAsync(async(req,res,next) =>{
  const newlisting =  new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  await newlisting.save();
  req.flash("success", "New Listing created!")
  res.redirect("/listings")
}));


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
      req.flash("error", "Listing you requested does not exist!")
      res.redirect("/listings")
    }
    res.render("./listings/edit", {listing});
 }));

//update Route
router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(async(req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`);
 }));

 //delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res) =>{
    let {id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted")
    res.redirect(`/listings`);
 }));


 


  module.exports = router;