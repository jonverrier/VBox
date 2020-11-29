'use strict';
// Copyright TXPCo ltd, 2020

var mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
   facilityId: {
      type: String,
      required: true,
      index: true
   }

   // TODO - class data such as whitebaord, clock, results eyc needs to be stored here in case coach app crashes / is closed. 
});

const callParticipantSchema = new mongoose.Schema({
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

const callParticipantModel = mongoose.model("CallParticipant", callParticipantSchema);
const callModel = mongoose.model("call", classSchema);

module.exports.callParticipantModel = callParticipantModel;
module.exports.callModel = callModel;
