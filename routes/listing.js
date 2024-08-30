const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapasync.js')
const Listing = require("../models/listings.js");
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js');
const multer  = require('multer')
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});



const lisitngController = require('../controllers/listing.js')


router.get("/", wrapAsync(lisitngController.index));

router.get('/:id/message', isLoggedIn, lisitngController.renderMessageForm);

router.get("/search", wrapAsync(lisitngController.searchListings));

router.get("/new",isLoggedIn, lisitngController.renderNewForm);

router.get("/:id" , wrapAsync(lisitngController.showListing));

router.post("/",isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(lisitngController.createListing));

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(lisitngController.editListing));

router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(lisitngController.updateListing));

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(lisitngController.destroyListing));

router.get("/:id/book",isLoggedIn,isOwner,wrapAsync(lisitngController.bookListing));


module.exports = router;