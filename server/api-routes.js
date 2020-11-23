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

         var myHomePageData = new HomePageData(req.user.name, req.user.thumbnailUrl,
                                               facilities[0], facilities); // TODO - pick the last facility visited by recording visits. 

         var output = JSON.stringify(myHomePageData);
         res.send(output);
      });
   } else {
      res.send(null);
   }
})

module.exports = router;