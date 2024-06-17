const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const Listing = require("./models/listings.js");
const methodoverride = require("method-override")
const ejsMate = require('ejs-mate');


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
app.use(express.static(path.join(__dirname,"public")));


app.get("/listings", async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("./listings/index", {allListings});
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
 app.get("/listings/:id" , async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show", {listing});
 });

//Edit Route
app.get("/listings/:id/edit", async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit", {listing});
 });

//update Route
app.put("/listings/:id", async(req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
 });

 app.delete("/listings/:id", async(req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
 });
 
 //create Route

 app.post("/listings", async(req,res) =>{
    const newlisting =  new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings")
 });

app.use((req,res) =>{
   res.status(404)
   res.render("./listings/error")
})

app.listen(port, () => console.log(`app is runnig at port ${port}`))