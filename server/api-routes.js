'use strict';
// Copyright TXPCo ltd, 2020

var express = require('express');
var router = express.Router();

// Core logic classes
var TypeRegistry = require('../common/types.js').TypeRegistry;
var Call = require("../common/call.js").Call;
var Person = require("../common/person.js").Person;
var Facility = require("../common/facility.js").Facility;

// Used to get data for the users home page 
var facilityModel = require("./facility-model.js");
var facilityCoachModel = require("./facilityperson-model.js").facilityCoachModel;
var facilityMemberModel = require("./facilityperson-model.js").facilityMemberModel;
var HomePageData = require("../common/homepagedata.js").HomePageData;

// Used to get data call participants
var callModel = require("./call-model.js").callModel;
var callParticipantModel = require("./call-model.js").callParticipantModel;

// event source APIs
var eventFeed = require('./event-source.js').eventFeed;
var broadcastNewParticipant = require('./event-source.js').broadcastNewParticipant;
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

async function attendeeIdListFor(facilityId) {

   // Find attendances where the facility is 'facilityId', then return just a list of peopleIds
   const attendances = await callParticipantModel.find().where('facilityId').eq(facilityId).exec();

   var attendees = new Array();

   for (let attendance of attendances)
      attendees.push(attendance.personId);

   return attendees;
}

// API to connect to event source
router.get('/callevents', function (req, res, next) {
   if (req.user && req.user.externalId) 
      return eventFeed(req, res, next);
   else
      res.send(null);
});

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

// API to get data for the an online class & register a new participant
router.get('/api/call', function (req, res) {
   if (req.user && req.user.externalId) {

      // Client passes CallParticipant in the query string
      var types = new TypeRegistry();
      var callParticipant = types.reviveFromJSON(req.query.callParticipant);

      // This pushes the notice of a new participant over server-sent event channel
      broadcastNewParticipant(callParticipant);

      // Just save the person-facility link - overrwite if there is already one there.
      const facilityId = callParticipant.facilityId; 
      const personId = callParticipant.personId;
      const callParticipantQuery = {
         facilityId, personId
      };

      // Atomic update
      callParticipantModel.findOneAndUpdate({ facilityId: facilityId, personId: personId },
         { callParticipantQuery },
         { upsert: true }, function (err, result) {
            if (err)
               ;
      }); 

      // Send back a populated Call object, which includes the Ids & IP addresses of all attendees
      attendeeIdListFor(facilityId).then(function (attendeeIds) {

         // remove the current person if they are in the list of attendees, so they just get a list of other people
         var found = false;
         for (var i = 0; i < attendeeIds.length; i++) {
            if (attendeeIds[i] == personId)
               attendeeIds.splice(i, 1);
         }

         var classData = new Call(null, facilityId, attendeeIds);
         var output = JSON.stringify(classData);
         res.send(output);
      });   
   } else {
      res.send(null);
   }
})

// API when a participant has a new offer
router.get('/api/offer', function (req, res) {
   if (req.user && req.user.externalId) {

      // Client passes CallOffer in the query string
      var types = new TypeRegistry();
      var callOffer = types.reviveFromJSON(req.query.callOffer);

      // This pushes the notice of a new offer over server-sent event channel
      deliverNewOffer(callOffer);

      res.send('OK');

   } else {
      res.send(null);
   }
})

// API when a participant has a new answer
router.get('/api/answer', function (req, res) {
   if (req.user && req.user.externalId) {

      // Client passes CallAnswer in the query string
      var types = new TypeRegistry();
      var callAnswer = types.reviveFromJSON(req.query.callAnswer);

      // This pushes the notice of a new offer over server-sent event channel
      deliverNewAnswer(callAnswer);

      res.send('OK');

   } else {
      res.send(null);
   }
})

// API when a participant has a new ICE candidate
router.get('/api/icecandidate', function (req, res) {
   if (req.user && req.user.externalId) {

      // Client passes CallIceCandidate in the query string
      var types = new TypeRegistry();
      var callIceCandidate = types.reviveFromJSON( req.query.callIceCandidate);

      // This pushes the notice of a new ICE candidate over server-sent event channel
      deliverNewIceCandidate(callIceCandidate);

      res.send('OK');

   } else {
      res.send(null);
   }
})

module.exports = router;