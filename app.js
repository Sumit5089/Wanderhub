const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const usermodel = require("./models/user.js");
const methodoverride = require("method-override")
const ejsMate = require('ejs-mate');
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const wrapAsync = require('./utils/wrapasync.js')
const ExpressError = require('./utils/expresserror.js')
const session = require('express-session')
const flash = require('connect-flash');



const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');


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



const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})

app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews )


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
 
 //profile route
 app.get("/profile",(req,res) =>{
   res.render("./listings/profile");
});


 

// login check
 app.post("/login", wrapAsync(async(req,res) =>{
   try{
    let user = await usermodel.findOne({email: req.body.email});

   bcrypt.compare(req.body.password, user.password, function (err, result){
   if(result){
   let token = jwt.sign({email: user.email}, "sumit");
   res.cookie("token", token)
   req.flash("success", `hii ${user.username} you logined succesfully!`)
   res.redirect("/listings");
   }
   })
   }
   catch (e){
    req.flash("error", "Username or Paasword is incorrect!")
    res.redirect("/login")
   }
   }));
 
 

 //create register
 app.post("/register", wrapAsync(async (req, res) => {
   try {
     let { username, email, password, confirm } = req.body;
 
     if (password !== confirm) {
      req.flash("error","Please confirm password!" )
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
     req.flash("success", "Registered Successfully!")
     res.redirect("/login");
   } catch (error) {
     console.error(error);
     res.status(500).send("Internal Server Error");
   }
 }));




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