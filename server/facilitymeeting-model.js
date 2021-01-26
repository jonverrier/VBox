'use strict';
// Copyright TXPCo ltd, 2020

var mongoose = require("mongoose");

const facilityMeetingSchema = new mongoose.Schema({
   facilityId: {
      type: String,
      required: true,
      index: true
   },
   meetingId: {
      type: String,
      required: true,
      index: true,
      unique: true
   },
   isActive: {
      type: Boolean,
   },
   description: {
      type: String,
      index: true,
      maxLength: 256
   }
},
   {  // Enable timestamps for archival as we allow archive of inactive meeting codes
      timestamps: true
   });

const facilityMeetingModel = mongoose.model("FacilityMeeting", facilityMeetingSchema);

module.exports.facilityMeetingModel = facilityMeetingModel;
