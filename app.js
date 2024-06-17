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


app.get("/listings", async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("./listings/index", {allListings});
 });

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

// login check
 app.post("/login", async(req,res) =>{
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
   });
 
 

 //create register
 app.post("/register", async (req, res) => {
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
 });
 

app.use((req,res) =>{
   res.status(404)
   res.render("./listings/error")
})

app.listen(port, () => console.log(`app is runnig at port ${port}`))