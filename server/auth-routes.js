'use strict';

var path = require('path');
var express = require('express');
var passport = require('passport');

// Not directly used here, but passport needs to be initialised with a Strategy
var authController = require("./auth-controller.js");

const authRouter = express.Router();

authRouter.get("/auth/facebook", passport.authenticate("facebook"));

var options = {
   root: path.join(__dirname, "..")
};

authRouter.get(
   "/auth/facebook/callback",
   passport.authenticate("facebook", {
      successRedirect: "/success",
      failureRedirect: "/fail"
   })
);

authRouter.get("/fail", (req, res) => {
   res.sendFile('public/logonnotallowed.html', options);
});

authRouter.get("/success", (req, res) => {

   // To do - look up facilities for the person, are they coach or member. 
   res.redirect("coach");
});

module.exports = authRouter;
