const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const Listing = require("./models/listings.js");
const usermodel = require("./models/user.js");
const methodoverride = require("method-override")
const ejsMate = require('ejs-mate');
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const wrapAsync = require('./utils/wrapasync.js')
const ExpressError = require('./utils/expresserror.js')
const { listingSchema, reviewSchema} = require('./schema.js');
const Review  = require('./models/review.js')



main()
.then(() => console.log("connection sucssefull"))
.catch((err) => console.log(err))

async function main() { 
    await mongoose.connect("mongodb://localhost:27017/newapp");
}

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname,"views"));
app.use(express.json());
app.use(methodoverride("_method"));
app.use(express.urlencoded({extended: true}));
app.engine("ejs", ejsMate);
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));



const validateListing = (req, res, next) => {
   let {error} = listingSchema.validate(req.body);

   if(error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
   } else{
      next();
   }
}

const validateReview = (req, res, next) => {
   let {error} = reviewSchema.validate(req.body);

   if(error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
   } else{
      next();
   }
};




app.get("/listings", wrapAsync(async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("./listings/index", {allListings});
 }));

//logut
app.get("/logout",(req,res) =>{
   res.cookie("token", ""),
   res.redirect("/login")
});

//register Route
 app.get("/register",(req,res) =>{
   res.render("layouts/registration.ejs");
});

//login Route
 app.get("/login",(req,res) =>{
   res.render("layouts/login.ejs");
});
//new Route
 app.get("/listings/new",(req,res) =>{
    res.render("./listings/new");
 });

 //profile route
 app.get("/profile",(req,res) =>{
   res.render("./listings/profile");
});

//show Route
 app.get("/listings/:id" , wrapAsync(async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show", {listing});
 }));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit", {listing});
 }));

//update Route
app.put("/listings/:id", validateListing, wrapAsync(async(req,res) =>{
    let {id} = req.params;
    updatedlisting = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
 }));

 //delete Route
 app.delete("/listings/:id",wrapAsync(async(req,res) =>{
    let {id} = req.params;
     deletedlisting = await Listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
 }));
 
 //create Route

 app.post("/listings",validateListing, wrapAsync (async(req,res,next) =>{
   let result = listingSchema.validate(req.body);
   if(result.error) {
      throw new ExpressError(400, result.error)
   }
    const newlisting =  new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings")
 }));

// login check
 app.post("/login", wrapAsync(async(req,res) =>{
   let user = await usermodel.findOne({email: req.body.email})
   if(!user) return res.send("user not found")

   bcrypt.compare(req.body.password, user.password, function (err, result){
   if(result){
   let token = jwt.sign({email: user.email}, "sumit");
   res.cookie("token", token)
   res.redirect("/listings");
   }
   else res.send("something went wrong")
   })
   }));
 
 

 //create register
 app.post("/register", wrapAsync(async (req, res) => {
   try {
     let { username, email, password, confirm } = req.body;
 
     if (password !== confirm) {
       return res.send("Passwords do not match");
     }
 
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password, salt);
 
     let createdUser = await usermodel.create({
       username,
       email,
       password: hashedPassword
     });
 
     let token = jwt.sign({ email }, "sumit");
     res.cookie("token", token);
     res.redirect("/login");
   } catch (error) {
     console.error(error);
     res.status(500).send("Internal Server Error");
   }
 }));

 //post Reviews

app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res) => {
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);

   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();

   res.redirect(`/listings/${listing._id}`)

}));

//review delete

app.delete("/listings/:id/reviews/:reviewid", wrapAsync(async (req,res) => {
   let {id, reviewid} = req.params;
   updatereview = await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewid}});
   deletereview = await Review.findByIdAndDelete(reviewid);
   res.redirect(`/listings/${id}`);
}))


 app.all("*", (req,res,next) =>{
   next(new ExpressError(404, "page not found"));
 });

app.use((req,res) =>{
   res.status(404)
   res.render("./listings/error")
})

app.use((err,req,res,next) =>{
   let {statuscode=500, message="Something Went wrong"} = err;
   res.render('customerror.ejs', {err})// res.status(statuscode).send(message)
})

app.listen(port, () => console.log(`app is runnig at port ${port}`))