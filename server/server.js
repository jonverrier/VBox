'use strict';
// Copyright TXPCo ltd, 2020

var path = require('path');
var express = require('express');
var errorHandler = require('errorhandler');
var compression = require('compression');
var passport = require('passport');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var connectMongo = require('connect-mongo')(session);

var pageRouter = require("./page-routes.js");
var authRouter = require("./auth-routes.js");
var apiRouter = require("./api-routes.js");
var initialiseEvents = require('./event-source.js').initialise;

// Control variables for development / production
var inDevelopment = false;
if (process.env.NODE_ENV === 'development') {
   inDevelopment = true;
   console.log('Using development options');
} else {
   console.log('Using production options');
}

// Initialize status middleware - files, cache etc
// Set cache parameter to one day unless in development, and include 'dev' directory if we are in development mode
// Note: do this BEFORE adding sessions, else sessions get called multiple times, 
// once for each asset including static ones
var cacheAge = 86400000; // 86400000 is One Day

// Insert versioning middleware before static
var currentVersion = '0.1';
var versionator = require('versionator').create(currentVersion);

var app = express();

// Force https
function requireHTTPS(req, res, next) {
   // The 'x-forwarded-proto' check is for Heroku
   if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
      return res.redirect('https://' + req.get('host') + req.url);
   }
   next();
}

app.use(function (req, res, next) {
   return requireHTTPS(req, res, next);
});

// Use versionator & compression for staic files
app.version = currentVersion;
app.use(versionator.middleware);
//app.use(compression());

// Allow files from ./public and ./dist to be used 
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../dist')));

if (inDevelopment) {
   // Set error handler. 
   app.use(errorHandler({ dumpExceptions: true, showStack: true }));

   // Allow files from ./src directory to be used 
   app.use(express.static(path.join(__dirname, '/client')));

   // Allow files from ./test directory to be used 
   app.use(express.static(path.join(__dirname, '/test')));
} 

// Allows you to set port in the project properties.
app.set('port', process.env.PORT || 3000);

// configure Session data & dependencies
app.use(cookieParser());    // Required to use sessions, below
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(                    // Use Mongo session store
   session({
      store: new connectMongo ({
         url: process.env.MONGODB_URI,
         ttl: 7200000 // = 2 hours 
      }),
      cookie: { maxAge: 7200000 },
      secret: process.env.NODE_SESSION_SECRET,
      saveUninitialized: true,
      resave: true,
      httpOnly: true,   // https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions/
      secure: true,     // use cookies only accessible from http, that get deleted when browser closes
      ephemeral: true
   }));

// Passport authentication
app.use(passport.initialize());
app.use(passport.session());

// Routes for user pages
app.use('/', pageRouter);

// Routes for auth pages
app.use('/', authRouter);

// Routes for API endpoints
app.use('/', apiRouter);

//redirect root to Login
app.get('/', function (req, res) {
   return res.redirect('/login');
});

// Fix depracation warning. This one is not  abreaking change. 
mongoose.set('useFindAndModify', false);

const connect = async () => {
   const db = mongoose.connection;

   try {
      await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

      // This initialises the sequence number for the event source
      initialiseEvents();

      console.log('Listening on ' + process.env.PORT + ' ...');

      /*
      if (false) {
        
         var fortitude = { externalId: "12341", name: "Fortitude Fitness London", thumbnailUrl: "FortitudeSquare.png" };
         var fitology = { externalId: "12342", name: "Fitology", thumbnailUrl: "FitologySquare.png" };
         var dulwich = { externalId: "12343", name: "Crossfit Dulwich", thumbnailUrl: "building-black128x128.png" };
         var test = { externalId: "12344", name: "Test facility", thumbnailUrl: "building-black128x128.png" };
         new facilityModel(fortitude).save(); 
         new facilityModel(fitology).save(); 
         new facilityModel(dulwich).save(); 
         new facilityModel(test).save(); 
      }

      if (false) {         
         var yCoach = {
            externalId: "100057896350026", name: "Y AllowedCoach", email: "y_allowedcoach_cxzsfkj_allowedcoach@tfbnw.net", thumbnailUrl: "person-white128x128.png", lastAuthCode: "0"
         };
         var yMember = {
            externalId: "103351181604960", name: "Y AllowedMember", email: "y_allowedmember_spaqhdv_allowedmember@tfbnw.net", thumbnailUrl: "person-white128x128.png", lastAuthCode: "0"
         };
         new personModel(yCoach).save();
         new personModel(yMember).save();
      }

      if (false) {
         var jon = { facilityId: "12343", personId: "10222806520938994"};
         var yCoach = { facilityId: "12344", personId: "100057896350026"};
         new facilityCoachModel(jon).save();
         new facilityCoachModel(yCoach).save();
      }
      */

   } catch (error) {
      console.log('Error:' + error);
   }
};

var server = app.listen(app.get('port'), function () {
   connect();
});
