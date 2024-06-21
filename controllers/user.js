const User = require('../models/user')


module.exports.renderSignup =  (req,res) =>{
    res.render('users/sigup')
}

module.exports.signup = async(req,res) =>{
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
 }

 module.exports.renderLogin = (req,res) =>{
    res.render("users/login")
}

module.exports.login = async(req,res) => {
    req.flash("success" , "welcome back to wanderHub!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl) 
}

module.exports.logout = (req,res) => {
    req.logout((err) =>{
       if(err){
        return next(err);
       } 
       req.flash("success", "you are logged out!");
       res.redirect("/listings")
    })
}