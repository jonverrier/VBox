'use strict';
// Copyright TXPCo ltd, 2020

var express = require('express');
var router = express.Router();

// Core logic classes
var TypeRegistry = require('../common/types.js').TypeRegistry;
var Person = require("../common/person.js").Person;
var CallOffer = require("../common/call.js").CallOffer;
var CallAnswer = require("../common/call.js").CallAnswer;
var CallIceCandidate = require("../common/call.js").CallIceCandidate;  

// Used to get data for the users home page 
var facilityModel = require("./facility-model.js");
var facilityCoachModel = require("./facilityperson-model.js").facilityCoachModel;
var facilityMemberModel = require("./facilityperson-model.js").facilityMemberModel;
var facilityMeetingModel = require("./facilitymeeting-model.js").facilityMeetingModel;
var leadModel = require("./lead-model.js").leadModel;
var HomePageData = require("../common/homepagedata.js").HomePageData;

var pkg = require('../Core/dist/cmn-bundle.js');
var EntryPoints = pkg.default;
var logger = new EntryPoints.LoggerFactory().logger(EntryPoints.LoggerType.Server);

// event source APIs
var eventFeed = require('./event-source.js').eventFeed;
var deliverNewOffer = require('./event-source.js').deliverNewOffer;
var deliverNewAnswer = require('./event-source.js').deliverNewAnswer;
var deliverNewIceCandidate = require('./event-source.js').deliverNewIceCandidate;

async function facilitiesFor (facilityIds) {
   var facilities = new Array();

   for (let id of facilityIds) {
      const facility = await facilityModel.findOne().where('externalId').eq(id).exec();
      facilities.push(facility);
   }
   return facilities;
}

async function facilityIdListForCoach(personId) {

   // Find facilities where the coach is 'personId'
   const facilityCoaches = await facilityCoachModel.find().where('personId').eq(personId).exec();

   var facilityIds = new Array();

   for (let facility of facilityCoaches)
      facilityIds.push(facility.facilityId);

   return facilitiesFor (facilityIds);
}

async function facilityIdListForMember(personId) {

   // Find facilities where the member is 'personId'
   const facilityMembers1 = await facilityMemberModel.find().where('personId').eq(personId).exec();

   // they might be a coach - retrieve those links
   const facilityMembers2 = await facilityCoachModel.find().where('personId').eq(personId).exec();

   const facilityMembers = facilityMembers1.concat(facilityMembers2);

   var facilityIds = new Array();

   for (let facility of facilityMembers)
      facilityIds.push(facility.facilityId);

   return facilitiesFor(facilityIds);
}

async function isMeeting (id) {

   const facilityMeeting = await facilityMeetingModel.findOne().where('meetingId').eq(id).exec();
   if (facilityMeeting)
      return true;
   else
      return false;
}

// API to connect to event source
router.get('/callevents', function (req, res, next) {
   if (req.user && req.user.externalId) 
      return eventFeed(req, res, next);
   else
      res.send(null);
});

// API to check if a code is a valide meeting - note, is unauthenticated. TODO - replace if ever get actual volume. 
router.get('/api/isvalidmc', function (req, res) {

   var meetingId = decodeURIComponent(req.query.meetingId);

   isMeeting(meetingId).then(function (isMeetingResult) {
      if (isMeetingResult) {
         res.send(true);
      } else {
         res.send(false);
      }
   });
})

// No-op on server
router.post('/api/keepalive', function (req, res) {

   res.send(true);
});

// This is a sign-up type request - does not need to be logged in
router.post('/api/lead', function (req, res) {
   var email = decodeURIComponent(req.body.params.email);
   if (email) {
      new leadModel({ email: email }).save();
      res.send(true);
   } else
      res.send(false);
});

function homePageDataFor (req, facilities) {

   var current = facilities[0]; // TODO - pick the last facility visited by recording visits. 
   // loop below just removes current from the extended list
   for (var i = 0; i < facilities.length; i++) {
      if (current.externalId === facilities[i].externalId) {
         var removed = facilities.splice(i, 1);
         break;
      }
   }

   var myHomePageData = new HomePageData(req.sessionID,
      new Person(null, req.user.externalId, req.user.name, null, req.user.thumbnailUrl, null),
      current, facilities);

   return JSON.stringify(myHomePageData);
}

// API to stop heroku killing us
router.post('/api/keepalive', function (req, res) {
   if (req.user && req.user.externalId) {
      res.send({ session: true });
   } else {
      res.send({ session: false });
   }
});

// API to test if the client app has a valid session
router.post('/api/sessiontest', function (req, res) {
   if (req.user && req.user.externalId) {
      res.send({session: true});
   } else {
      res.send({ session: false });
   }
});

// API to test if the client app has a valid session
router.post('/api/logout', function (req, res) {
   if (req.user) {
      req.logout();
      res.send({ session: true });
   } else {
      res.send({ session: false });
   }
});

// API to get data for the home page 
router.get('/api/home', function (req, res) {
   if (req.user && req.user.externalId) {

      // Log session starts - later on can trawl this for billing. 
      logger.logInfo ('Api-Routes', '/api/home', 'Session start.', {
         userId: req.user.externalId,
         userName: req.user.name
      });

      var coach = decodeURIComponent(req.query.coach);

      if (coach === 'true') {
         facilityIdListForCoach(req.user.externalId).then(function (facilities) {
            var output = homePageDataFor(req, facilities);
            res.send(output);
         });
      } else {
         facilityIdListForMember(req.user.externalId).then(function (facilities) {
            var output = homePageDataFor(req, facilities);
            res.send(output);
         });
      }
   } else {
      res.send(null);
   }
});

// API when a participant has a new offer
router.post('/api/offer', function (req, res) {
   if (req.user && req.user.externalId) {

      // Client passes CallOffer in the query string
      var types = new TypeRegistry();
      var callOffer = CallOffer.prototype.revive(req.body.params.callOffer);

      // This pushes the notice of a new offer over server-sent event channel
      deliverNewOffer(callOffer);

      res.send('OK');

   } else {
      res.send(null);
   }
});

// API when a participant has a new answer
router.post('/api/answer', function (req, res) {
   if (req.user && req.user.externalId) {

      // Client passes CallAnswer in the query string
      var types = new TypeRegistry();
      var callAnswer = CallAnswer.prototype.revive(req.body.params.callAnswer);

      // This pushes the notice of a new offer over server-sent event channel
      deliverNewAnswer(callAnswer);

      res.send('OK');

   } else {
      res.send(null);
   }
});

// API when a participant has a new ICE candidate
router.post('/api/icecandidate', function (req, res) {
   if (req.user && req.user.externalId) {

      // Client passes CallIceCandidate in the query string
      var types = new TypeRegistry();
      var callIceCandidate = CallIceCandidate.prototype.revive(req.body.params.callIceCandidate);

      // This pushes the notice of a new ICE candidate over server-sent event channel
      deliverNewIceCandidate(callIceCandidate);

      res.send('OK');

   } else {
      res.send(null);
   }
});

// API to echo error messages shipped from the client
router.post('/api/error', function (req, res) {

   var message = decodeURIComponent(req.body.params.message);

   if (req.user) {
      logger.logError('Api-Routes', '/api/error', 'Error:', {
         userId: req.user.externalId,
         userName: req.user.name,
         message: message
      });
   } else {
      logger.logError('Api-Routes', '/api/error', 'Error:', {
         message: message
      });
   }
   res.send(null);
});

module.exports = router;