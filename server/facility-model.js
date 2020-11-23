'use strict';
// Copyright TXPCo ltd, 2020

var mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema({
   externalId: {
      type: String,
      required: true,
      index: true,
      unique: true
   },
   name: {
      type: String,
      required: true,
      index: true 
   },
   thumbnailUrl: {
      type: String,
      required: true
   }
});

const facilityModel = mongoose.model("Facility", facilitySchema);

module.exports = facilityModel;
