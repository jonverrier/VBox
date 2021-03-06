'use strict';
// Copyright TXPCo ltd, 2020, 2021

var path = require('path');
var express = require('express');
var passport = require('passport');

// Not directly used here, but passport needs to be initialised with a Strategy
var authController = require("./auth-controller.js");

// Ued to direct authenticated users to the right home page
var facilityCoachModel = require("./facilityperson-model.js").facilityCoachModel;

const authRouter = express.Router();

authRouter.get("/auth/facebook", (req, res, next) => {

   // extract and save meeting Id in session - we sent it back again later in the URL so the client knows there has been a round trip
   var meetingId = decodeURIComponent(req.query.meetingId);
   req.session.meetingId = meetingId;

   return passport.authenticate("Facebook")(req, res, next);
});

authRouter.get("/auth/local", passport.authenticate("Local", {
   successRedirect: "/successmc",
   failureRedirect: "/failmc"
}));

authRouter.post('/data_deletionfb', (req, res, next) => {

   // TODO - do we need to do anything more
   // we don't actually hold any user data 

   res.send({ url: "https://ultrabox.herokuapp.com/datadeleted", confirmation_code: 'UB100'});
});

authRouter.get('/data_deletionfb', (req, res, next) => {

   // TODO - do we need to do anything more
   // we don't actually hold any user data 

   res.send({ url: "https://ultrabox.herokuapp.com/datadeleted", confirmation_code: 'UB100' });
});


authRouter.get('/datadeleted', function (req, res) {
   var options = {
      root: path.join(__dirname, "..")
   };
   res.sendFile('public/datadeleted.html', options);
});

var options = {
   root: path.join(__dirname, "..")
};

authRouter.get("/successmc", (req, res) => {
   res.send(true);
});

authRouter.get("/failmc", (req, res) => {
   res.send(false);
});

authRouter.get(
   "/auth/facebook/callback",
   passport.authenticate("Facebook", {
      successRedirect: "/successfb",
      failureRedirect: "/failfb"
   })
);

authRouter.get("/failfb", (req, res) => {
   res.sendFile('public/logonnotallowed.html', options);
});

authRouter.get("/successfb", (req, res) => {

   facilityCoachModel.findOne().where('personId').eq(req.user.externalId).exec(function (err, facilityCoach) {

      // Extract meeting id from session - we put it there before redirect to facebook.
      var meetingId = req.session.meetingId;
      // req.session.meetingId = {};

      if (facilityCoach)
         res.redirect("coach" + '?meetingId=' + meetingId);
      else
         res.redirect("member");
   });
});

authRouter.post("/auth/logout", (req, res) => {

   if (req.user)
      req.logout();
   
   if (req.session) {
      req.session.destroy(function (err) {
         res.send(true);
      });
   } else
      res.send(false);
});

module.exports = authRouter;
