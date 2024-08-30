const Listing = require('../models/listings')


module.exports.searchListings = async (req, res) => {
  const { q } = req.query;
  const regex = new RegExp(q, 'i'); // 'i' makes it case insensitive
  const searchResults = await Listing.find({
      $or: [
          { title: regex },
          { description: regex },
          { location: regex },
          { country: regex },
          { type: regex } // Add any other fields you want to search in
      ]
  });
  res.render('./listings/index', { allListings: searchResults });
};


module.exports.renderMessageForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate('owner');
  if (!listing) {
      req.flash('error', 'Listing not found');
      return res.redirect('/listings');
  }
  res.render('./listings/messageHost', { listing });
};

module.exports.index = async (req, res) => {
  const { type } = req.query;
  let filter = {};
  if (type) {
      filter.type = type;
  }
  const allListings = await Listing.find(filter);
  res.render("./listings/index", { allListings });
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
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting =  new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url , filename};
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
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing });
    if(typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url , filename};
      await listing.save();
   }
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`);
 }

 module.exports.destroyListing = async(req,res) =>{
    let {id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted")
    res.redirect(`/listings`);
 }

 module.exports.bookListing = async(req,res) =>{
   let {id} = req.params;
   const listing = await Listing.findById(id);
   if(!listing) {
     req.flash("error", "Listing you requested does not exist!")
     res.redirect("/listings")
   }
   res.render("./listings/book", {listing});
}
