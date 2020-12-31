'use strict';
// Copyright TXPCo ltd, 2020

var express = require('express');
var router = express.Router();

// Core logic classes
var TypeRegistry = require('../common/types.js').TypeRegistry;
var Call = require("../common/call.js").Call;
var Person = require("../common/person.js").Person;

// Used to get data for the users home page 
var facilityModel = require("./facility-model.js");
var facilityCoachModel = require("./facilityperson-model.js").facilityCoachModel;
var HomePageData = require("../common/homepagedata.js").HomePageData;

// Used to get data call participants
var callModel = require("./call-model.js").callModel;
var callSessionModel = require("./call-model.js").callSessionModel;

// event source APIs
var eventFeed = require('./event-source.js').eventFeed;
var broadcastNewParticipation = require('./event-source.js').broadcastNewParticipation;
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