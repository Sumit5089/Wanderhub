const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapasync.js')
const Listing = require("../models/listings.js");
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js');
const multer  = require('multer')
const upload = multer({dest: 'uploads/'})


const lisitngController = require('../controllers/listing.js')


router.get("/", wrapAsync(lisitngController.index));

router.get("/new",isLoggedIn, lisitngController.renderNewForm);

router.get("/:id" , wrapAsync(lisitngController.showListing));

//  router.post("/",isLoggedIn, validateListing, wrapAsync(lisitngController.createListing));
router.post( "/" , upload.single('listing[image]'),(req,res) => {
    res.send(req.file);
})

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(lisitngController.editListing));

router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(lisitngController.updateListing));

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(lisitngController.destroyListing));


module.exports = router;