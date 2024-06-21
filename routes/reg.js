
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