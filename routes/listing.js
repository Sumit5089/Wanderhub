const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapasync.js')
const Listing = require("../models/listings.js");
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js')


const lisitngController = require('../controllers/listing.js')

//all listings 
router.get("/", wrapAsync(lisitngController.index));

 // new listing
router.get("/new",isLoggedIn, lisitngController.renderNewForm);

 //show Route
router.get("/:id" , wrapAsync(lisitngController.showListing));

 //create Route
 router.post("/",isLoggedIn, validateListing, wrapAsync(lisitngController.createListing));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(lisitngController.editListing));

//update Route
router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(lisitngController.updateListing));

 //delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(lisitngController.destroyListing));


module.exports = router;