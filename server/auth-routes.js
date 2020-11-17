'use strict';

var express = require('express');
var passport = require('passport');

// Not directly used here, but passport needs to be initialised with a Strategy
var authController = require("./auth-controller.js");

const authRouter = express.Router();

authRouter.get("/auth/facebook", passport.authenticate("facebook"));

authRouter.get(
   "/auth/facebook/callback",
   passport.authenticate("facebook", {
      successRedirect: "/success",
      failureRedirect: "/fail"
   })
);

authRouter.get("/fail", (req, res) => {
   res.send("Failed attempt");
});

authRouter.get("/success", (req, res) => {
   res.send("Success");
});

module.exports = authRouter;
