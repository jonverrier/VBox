'use strict';

var mongoose = require("mongoose");

const facilityCoachSchema = new mongoose.Schema({
   facilityId: {
      type: String,
      required: true,
      index: true
   },
   personId: {
      type: String,
      required: true,
      index: true
   }
});

const facilityCoachModel = mongoose.model("FacilityCoach", facilityCoachSchema);

module.exports = facilityCoachModel;
