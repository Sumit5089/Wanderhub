const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const Listing = require("./models/listings.js");


main()
.then(() => console.log("connection sucssefull"))
.catch((err) => console.log(err))

async function main() { 
    await mongoose.connect("mongodb://localhost:27017/newapp");
}

app.set('view engine', 'ejs')
app.set("views", path.join(__dirname,"views"));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname,"public")))


app.get("/listings", async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("./listings/index", {allListings});
 });

 app.get("/listings/:id" , async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show", {listing});

 });


app.listen(port, () => console.log(`app is runnig at port ${port}`))