'use strict';
// Copyright TXPCo ltd, 2020

var mongoose = require("mongoose");

const facilityPersonSchema = new mongoose.Schema({
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

const facilityCoachModel = mongoose.model("FacilityCoach", facilityPersonSchema);
const facilityMemberModel = mongoose.model("FacilityMember", facilityPersonSchema);

module.exports.facilityCoachModel = facilityCoachModel;
module.exports.facilityMemberModel = facilityMemberModel;
