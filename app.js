if(process.env.NODE_ENV != "production") {
require('dotenv').config();
}
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const methodoverride = require("method-override")
const ejsMate = require('ejs-mate');
const cookieParser = require('cookie-parser')
const ExpressError = require('./utils/expresserror.js')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');




const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');


// const DB_URL = process.env.ATLASDB_URL;
const uri = "mongodb://localhost:27017/newapp"
main()
.then(() => console.log("connection sucssefull"))
.catch((err) => console.log(err))

async function main() { 
    await mongoose.connect(uri);
}



app.set('view engine', 'ejs');
app.set("views", path.join(__dirname,"views"));
app.use(express.json());
app.use(methodoverride("_method"));
app.use(express.urlencoded({extended: true}));
app.engine("ejs", ejsMate);
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));


// const store = MongoStore.create({
//   mongoUrl: DB_URL,
//   crypto: {
//     secret: process.env.SECRET,
//   },
//   touchAfter: 24 * 3600,
// });

// store.on("error", () => {
//    console.log("ERROR in MONGO SESSION STORE", err)
// })

const sessionOptions = {
  // store,
  secret: process.env.SECRET,
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

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRouter )
app.use("/", userRouter)

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
