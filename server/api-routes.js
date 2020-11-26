'use strict';
// Copyright TXPCo ltd, 2020

var express = require('express');
var router = express.Router();

// Used to get data for the users home page 
var facilityModel = require("./facility-model.js");
var facilityCoachModel = require("./facilityperson-model.js").facilityCoachModel;
var facilityMemberModel = require("./facilityperson-model.js").facilityMemberModel;
var facilityAttendanceModel = require("./facilityperson-model.js").facilityAttendanceModel;
var HomePageData = require("../common/homepagedata.js").HomePageData;

// Used to get data for online class participants
var onlineClassModel = require("./onlineClass-model.js").classModel;
var OnlineClass = require("../common/onlineclass.js").OnlineClass;

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
   const attendances = await facilityAttendanceModel.find().where('facilityId').eq(facilityId).exec();

   var attendees = new Array();

   for (let attendance of attendances)
      attendees.push(attendance.personId);

   return attendees;
}

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

         var myHomePageData = new HomePageData(req.user.name, req.user.thumbnailUrl,
                                               current, facilities); 

         var output = JSON.stringify(myHomePageData);
         res.send(output);
      });
   } else {
      res.send(null);
   }
})

// API to get data for the an online class 
router.get('/api/onlineclass', function (req, res) {
   if (req.user && req.user.externalId) {

      /** get calling IP address from the request */
      const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
      
      // Just save the person-facility link - overrwite if there is already one there.
      const facilityId = req.query.facilityId; // Client passes facility ID in the query string
      const personId = req.user.externalId;
      const facilityPerson = {
         facilityId, personId
      };

      facilityAttendanceModel.findOne(facilityPerson, function (err, foundFacilityPerson) {
         if (!err && foundFacilityPerson)
            new facilityAttendanceModel(foundFacilityPerson).updateOne();
         else
            new facilityAttendanceModel(facilityPerson).save();
      });


      // Send back a populated OnlineClass object, which includes the Ids & IP addresses of all attendees
      attendeeIdListFor(facilityId).then(function (attendeeIds) {

         // remove the current person if they are in the list of attendees, so they just get a list of other people
         var found = false;
         for (var i = 0; i < attendeeIds.length; i++) {
            if (attendeeIds[i] == personId)
               attendeeIds.splice(i, 1);
         }

         var classData = new OnlineClass(null, req.query.facilityId, attendeeIds);
         var output = JSON.stringify(classData);
         res.send(output);
      });   
   } else {
      res.send(null);
   }
})

module.exports = router;