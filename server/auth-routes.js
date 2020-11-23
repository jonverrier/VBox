'use strict';
// Copyright TXPCo ltd, 2020

var path = require('path');
var express = require('express');
var passport = require('passport');

// Not directly used here, but passport needs to be initialised with a Strategy
var authController = require("./auth-controller.js");

// Ued to direct authenticated users to the right home page
var facilityCoachModel = require("./facilityCoach-model.js");

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

   facilityCoachModel.findOne().where('personId').eq(req.user.externalId).exec(function (err, facilityCoach) {
      if (facilityCoach)
         res.redirect("coach");
      else
         res.redirect("member");
   });
});

module.exports = authRouter;
