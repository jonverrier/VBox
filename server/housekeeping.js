'use strict';
// Copyright TXPCo ltd, 2020

var path = require('path');
var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var connectMongo = require('connect-mongo')(session);
var errorHandler = require('errorhandler');

// Control variables for development / production
var inDevelopment = false;
if (process.env.NODE_ENV === 'development') {
   inDevelopment = true;
   console.log('Using development options');
} else {
   console.log('Using production options');
}

// Model for signalMessage
var SignalMessageModel = require("../server/signalmessage-model.js");
var PersonModel = require("./person-model.js");
var FacilityMemberModel = require("./facilityperson-model.js").facilityMemberModel;

var app = express();

app.use(                    // Use Mongo session store
   session({
      store: new connectMongo({
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


// Set error handler. 
app.use(errorHandler({ dumpExceptions: true, showStack: true }));


// Allows you to set port in the project properties.
app.set('port', process.env.PORT || 3000);

// Fix depracation warning. This one is not  abreaking change. 
mongoose.set('useFindAndModify', false);

var args = process.argv.slice(2);
var deleteMode = false;
var target =args[0];

switch (args[1]) {
   case 'delete':
      console.log('In delete mode');
      deleteMode = true;
      break;
   default:
      break;
}

const connect = async () => {
   const db = mongoose.connection;

   try {
      await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

      var now = new Date();
      var limit = new Date();
      limit.setTime(now.getTime() - 1000 * 60 * 60 * 24); // Archive anything over a day old. 

      if (deleteMode) {
         switch (target) {
            case "People":
               // Remove all old People where the email is made up (no @ sign) 
               PersonModel.deleteMany({ updatedAt: { $lt: limit }, email: { $not: { $regex: ".*@.*" } } })
                  .sort({ 'updatedAt': 1 })
                  .limit(100)
                  .exec(function (err, people) {
                     process.exit();
                  });
               break;
            case 'Signals':
               // Remove all old signal messages
               SignalMessageModel.deleteMany({
                  updatedAt: { $lt: limit }
               })
                  .limit(100)
                  .sort({ 'updatedAt': 1 })
                  .exec(function (err, messages) {
                     process.exit();
                  });
               break
            case "FacilityMembers":
               FacilityMemberModel.deleteMany({
                  // temporary: true,
                  updatedAt: { $lt: limit }
               })
                  .sort({ 'updatedAt': 1 })
                  .limit(100)
                  .exec(function (err, people) {

                     process.exit();
                  });
               break;
            default:
               console.log('Nothing to do.');
               process.exit();
               break;
         }
      } else {
         switch (target) {
            case "People":
               PersonModel.find({ updatedAt: { $lt: limit }, email: { $not: { $regex: ".*@.*" } } })
                  .sort({ 'updatedAt': 1 })
                  .limit(100)
                  .exec(function (err, people) {
                     for (var i = 0; i < people.length; i++) {
                        console.log(JSON.stringify(people[i]) + '\n');
                     }
                     process.exit();
                  });
               break;
            case 'Signals':
               // Remove all old signal messages
               SignalMessageModel.find({
                  updatedAt: { $lt: limit }
               })
                  .limit(100)
                  .sort({ 'updatedAt': 1 })
                  .exec(function (err, messages) {
                     for (var i = 0; i < messages.length; i++) {
                        console.log(JSON.stringify(messages[i]) + '\n');
                     }
                     process.exit();
                  });
               break;
            case "FacilityMembers":
               FacilityMemberModel.find({
                  // temporary: true,
                  updatedAt: { $lt: limit }
               })
                  .sort({ 'updatedAt': 1 })
                  .limit(100)
                  .exec(function (err, people) {
                     for (var i = 0; people && i < people.length; i++) {
                        console.log(JSON.stringify(people[i]) + '\n');
                     }
                     process.exit();
                  });
               break;
            default:
               console.log('Nothing to do.');
               process.exit();
               beak;
         }
      }
   } catch (error) {
      console.log('Error:' + error);
   }
};

var server = app.listen(app.get('port'), function () {
   connect();
});
