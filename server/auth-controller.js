'use strict';
// Copyright TXPCo ltd, 2020

var passport = require("passport");
var passportFacebook = require("passport-facebook");
var passportLocal = require("passport-local");

var personModel = require("./person-model.js");

const FacebookStrategy = passportFacebook.Strategy;
const LocalStrategy = passportLocal.Strategy;

function save(user, accessToken) {
   const email = user.email;
   const name = user.first_name + ' ' + user.last_name;
   const thumbnailUrl = 'https://graph.facebook.com/' + user.id.toString() + '/picture';
   const lastAuthCode = accessToken;
   const externalId = user.id;

   const userData = {
      externalId, email, name, thumbnailUrl, lastAuthCode
   };
   personModel.findOne().where('email').eq(email).exec(function (err, person) {
      if (!err && person) {
         person.externalId = externalId;
         person.name = name;
         person.thumbnailUrl = thumbnailUrl;
         if (lastAuthCode) // Only overwrite token if we have a new one
            person.lastAuthCode = lastAuthCode;
         person.save();
      }
      else {
         new personModel(userData).save();
      }
   });
};

function find (id, fn) {
   personModel.findOne().where('externalId').eq(id).exec(function (err, person) {
      if (!err && person) {
         fn(err, person);
      } else
         fn(err, null);
   });
};

passport.serializeUser(function (user, done) {
   done(null, user.id);
});

passport.deserializeUser(function (id, done) {
   find(id, function (err, user) {
      done(err, user);
   });
});

passport.use(
   'Facebook', new FacebookStrategy(
      {
         clientID: process.env.FACEBOOK_APP_ID_PROD ,
         clientSecret: process.env.FACEBOOK_APP_SECRET_PROD,
         callbackURL: process.env.FACEBOOK_APP_CALLBACK,
         profileFields: ["email", "name", "displayName"]
      },
      function (accessToken, refreshToken, profile, done) {
         save(profile._json, accessToken);
         done(null, profile); 
      }
   )
);

