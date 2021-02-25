'use strict';
// Copyright TXPCo ltd, 2020

var mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema({
   externalId: {
      type: String,
      required: true,
      index: true,
      unique: true,
      alias: '_externalId'
   },
   name: {
      type: String,
      required: true,
      index: true,
      alias: '_name' 
   },
   thumbnailUrl: {
      type: String,
      required: true,
      alias: '_thumbnailUrl'
   },
   homepageUrl: {
      type: String,
      required: true,
      alias: '_homepageUrl'
   }
});

const facilityModel = mongoose.model("Facility", facilitySchema);

module.exports = facilityModel;
