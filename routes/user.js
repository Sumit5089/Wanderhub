const express = require("express");
const router = express.Router();
const User = require('../models/user');
const wrapasync = require("../utils/wrapasync");
const passport = require('passport');
const { savedRedirectUrl } = require("../middleware");

const userController = require('../controllers/user')


router.get("/signup",userController.renderSignup)

router.post("/signup", wrapasync(userController.signup));

router.get("/login", userController.renderLogin);

router.post("/login", savedRedirectUrl,  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }) , userController.login);

router.get("/logout", userController.logout);


module.exports = router;