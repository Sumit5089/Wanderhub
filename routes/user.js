const express = require("express");
const router = express.Router();
const User = require('../models/user');
const wrapasync = require("../utils/wrapasync");
const passport = require('passport');
const { savedRedirectUrl } = require("../middleware");

router.get("/signup", (req,res) =>{
    res.render('users/sigup')
})


router.post("/signup", wrapasync(async(req,res) =>{
   try{
    let {username, email, password} = req.body;
    const newUser = new User({email, username});
    const Registereduser = await User.register(newUser, password) ;
    console.log(Registereduser)
    req.login(Registereduser , (err) =>{
        if(err) {
            return next(err);
        }
        req.flash("success", "welcome to Wanderhub");
        res.redirect("/listings")
    })
   } catch(e){
    req.flash("error", e.message);
    res.redirect("/signup")
   }

})
);


router.get("/login", (req,res) =>{
    res.render("users/login")
});

router.post( "/login", savedRedirectUrl,  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }) , async(req,res) => {
    req.flash("success" , "welcome back to wanderHub!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl) 
});

router.get("/logout", (req,res) => {
    req.logout((err) =>{
       if(err){
        return next(err);
       } 
       req.flash("success", "you are logged out!");
       res.redirect("/listings")
    })
});


module.exports = router;