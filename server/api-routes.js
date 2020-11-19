'use strict';

var express = require('express');
var router = express.Router();

// Ued to get data for the users home page 
var facilityModel = require("./facility-model.js");
var facilityCoachModel = require("./facilityCoach-model.js");

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

         var myHomePageData = {
            thumbNailUrl: req.user.thumbnailUrl,
            facilities: facilities
         };

         var output = JSON.stringify(myHomePageData);
         res.send(output);
      });
   } else {
      res.send(null);
   }
})

module.exports = router;