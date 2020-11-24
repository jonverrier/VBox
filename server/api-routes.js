'use strict';
// Copyright TXPCo ltd, 2020

var express = require('express');
var router = express.Router();

// Ued to get data for the users home page 
var facilityModel = require("./facility-model.js");
var facilityCoachModel = require("./facilityCoach-model.js");
var HomePageData = require("../common/homepagedata.js").HomePageData;

async function facilitiesFor (facilityIds) {
   var facilities = new Array();

   for (let id of facilityIds) {
      const facility = await facilityModel.findOne().where('externalId').eq(id).exec();
      facilities.push(facility);
   }
   return facilities;
}

async function facilityListFor(personId) {

   const facilityCoaches = await facilityCoachModel.find().where('personId').eq(personId).exec();

   var facilityIds = new Array();

   for (let facility of facilityCoaches)
      facilityIds.push(facility.facilityId);

   return facilitiesFor (facilityIds);
}

// API to get data for the home page 
router.get('/api/home', function (req, res) {
   if (req.user && req.user.externalId) {

      facilityListFor (req.user.externalId).then(function (facilities) {

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

module.exports = router;