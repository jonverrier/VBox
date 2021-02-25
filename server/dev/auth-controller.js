'use strict';
// Copyright TXPCo ltd, 2020

var passport = require("passport");
var passportFacebook = require("passport-facebook");
var passportLocal = require("passport-custom");
var { nanoid } = require("nanoid");

// Core logic classes
var pkg = require('../dist/core-bundle.js');
var EntryPoints = pkg.default;
var logger = new EntryPoints.LoggerFactory().logger(EntryPoints.LoggerType.Server);

// Used to look up valid meeting IDs for unauthenticated users
var facilityMeetingModel = require("./facilitymeeting-model.js").facilityMeetingModel;
var personModel = require("./person-model.js");
var facilityMemberModel = require("./facilityperson-model.js").facilityMemberModel;

const FacebookStrategy = passportFacebook.Strategy;
const LocalStrategy = passportLocal.Strategy;

// Control variables for development / production
var inDevelopment = false;
if (process.env.NODE_ENV === 'development') {
   inDevelopment = true;
   logger.logInfo('Auth-Controller', 'Main:', 'Passport using development options.', null);
} else {
   logger.logInfo('Auth-Controller', 'Main:', 'Passport using production options.', null);
}

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
         clientID: inDevelopment ? process.env.FACEBOOK_APP_ID_DEV : process.env.FACEBOOK_APP_ID_PROD ,
         clientSecret: inDevelopment ? process.env.FACEBOOK_APP_SECRET_DEV : process.env.FACEBOOK_APP_SECRET_PROD,
         callbackURL: inDevelopment ? process.env.FACEBOOK_APP_CALLBACK : process.env.FACEBOOK_APP_CALLBACK,
         profileFields: ["email", "name", "displayName"]
      },
      function (accessToken, refreshToken, profile, done) {
         save(profile._json, accessToken);
         done(null, profile); 
      }
   )
);

passport.use(
   'Local', new LocalStrategy(
      function (req, done) {
         var meetingId = decodeURIComponent(req.query.meetingId);
         var name = decodeURIComponent(req.query.name);

         // TODO
         if (inDevelopment && name === 'Jon Verrier' ) {
            const userData = { name: name, externalId: "10222806520938994", thumbnailUrl: 'person-w-128x128.png', lastAuthCode: null, id: "10222806520938994" };

            done(null, userData);
         }
         else {
            // if there is a valid URL for the meeting, create a psuedo record for the user
            facilityMeetingModel.findOne().where('meetingId').eq(meetingId).exec(function (err, facilityMeeting) {
               if (facilityMeeting) {
                  var generatedId = nanoid(10);

                  // Save as a new Person. TODO - review this use of email
                  const userData = { name: name, externalId: generatedId, email: generatedId, thumbnailUrl: 'person-w-128x128.png', lastAuthCode: null, id: generatedId };
                  new personModel(userData).save();

                  // Save the link to the facility
                  const facilityMemberData = { facilityId: facilityMeeting.facilityId, personId: generatedId, temporary: true };
                  new facilityMemberModel(facilityMemberData).save();

                  done(err, userData);
               } else {
                  done(err, null);
               }
            });
         }
      })
);