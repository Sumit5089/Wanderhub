const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapasync.js')
const ExpressError = require('../utils/expresserror.js')
const { listingSchema} = require('../schema.js');
const Listing = require("../models/listings.js");



const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
 
    if(error) {
       let errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400, errMsg);
    } else{
       next();
    }
 }

//show route
router.get("/", wrapAsync(async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("./listings/index", {allListings});
 }));

 // new listing
router.get("/new",(req,res) =>{
    res.render("./listings/new");
 });

 //show Route
router.get("/:id" , wrapAsync(async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show", {listing});
 }));

//Edit Route
router.get("/:id/edit", wrapAsync(async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit", {listing});
 }));

//update Route
router.put("/:id", validateListing, wrapAsync(async(req,res) =>{
    let {id} = req.params;
    updatedlisting = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
 }));

 //delete Route
router.delete("/:id",wrapAsync(async(req,res) =>{
    let {id} = req.params;
     deletedlisting = await Listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
 }));


 
 //create Route

router.post("/",validateListing, wrapAsync (async(req,res,next) =>{
    let result = listingSchema.validate(req.body);
    if(result.error) {
       throw new ExpressError(400, result.error)
    }
     const newlisting =  new Listing(req.body.listing);
     await newlisting.save();
     res.redirect("/listings")
  }));

  module.exports = router;