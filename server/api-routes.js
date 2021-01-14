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
var facilityMeetingModel = require("./facilitymeeting-model.js").facilityMeetingModel;
var HomePageData = require("../common/homepagedata.js").HomePageData;

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

async function facilityIdListFor(personId) {

   // Find facilities where the coach is 'personId'
   const facilityCoaches = await facilityCoachModel.find().where('personId').eq(personId).exec();

   var facilityIds = new Array();

   for (let facility of facilityCoaches)
      facilityIds.push(facility.facilityId);

   return facilitiesFor (facilityIds);
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

// API to get data for the home page 
router.get('/api/home', function (req, res) {
      if (req.user && req.user.externalId) {

      facilityIdListFor (req.user.externalId).then(function (facilities) {

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

         var output = JSON.stringify(myHomePageData);
         res.send(output);
      });
   } else {
      res.send(null);
   }
})

// API when a participant has a new offer
router.post ('/api/offer', function (req, res) {
   if (req.user && req.user.externalId) {

      // Client passes CallOffer in the query string
      var types = new TypeRegistry();
      var callOffer = CallOffer.prototype.revive (req.body.params.callOffer);

      // This pushes the notice of a new offer over server-sent event channel
      deliverNewOffer(callOffer);

      res.send('OK');

   } else {
      res.send(null);
   }
})

// API when a participant has a new answer
router.post ('/api/answer', function (req, res) {
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
})

// API when a participant has a new ICE candidate
router.post ('/api/icecandidate', function (req, res) {
   if (req.user && req.user.externalId) {

      // Client passes CallIceCandidate in the query string
      var types = new TypeRegistry();
      var callIceCandidate = CallIceCandidate.prototype.revive (req.body.params.callIceCandidate);

      // This pushes the notice of a new ICE candidate over server-sent event channel
      deliverNewIceCandidate(callIceCandidate);

      res.send('OK');

   } else {
      res.send(null);
   }
})

module.exports = router;