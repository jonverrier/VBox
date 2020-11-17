'use strict';

var passport = require("passport");
var strategy = require("passport-facebook");

var personModel = require("./person-model.js");

const FacebookStrategy = strategy.Strategy;

passport.serializeUser(function (user, done) {
   done(null, user);
});

passport.deserializeUser(function (obj, done) {
   done(null, obj);
});

passport.use(
   new FacebookStrategy(
      {
         clientID: process.env.FACEBOOK_APP_ID_PROD ,
         clientSecret: process.env.FACEBOOK_APP_SECRET_PROD,
         callbackURL: process.env.FACEBOOK_APP_CALLBACK,
         profileFields: ["email", "name"]
      },
      function (accessToken, refreshToken, profile, done) {
         const email = profile._json.email;
         const name = profile._json.first_name + ' ' + profile._json.last_name;
         const thumbnailUrl = 'https://graph.facebook.com/' + profile._json.id.toString() + '/picture';
         const lastAuthCode = accessToken;
         const userData = {
            email, name, thumbnailUrl, lastAuthCode
         };
         new personModel(userData).save();
         done(null, profile);
      }
   )
);

