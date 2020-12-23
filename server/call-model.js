'use strict';
// Copyright TXPCo ltd, 2020

var mongoose = require("mongoose");

const callSchema = new mongoose.Schema({
   facilityId: {
      type: String,
      required: true,
      index: true
   }

   // TODO - class data such as whitebaord, clock, results eyc needs to be stored here in case coach app crashes / is closed. 
});

const callSessionSchema = new mongoose.Schema({
   sessionId: {
      type: String,
      required: true,
      index: true
   },
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

const callSessionModel = mongoose.model("CallSession", callSessionSchema);
const callModel = mongoose.model("call", callSchema);

module.exports.callSessionModel = callSessionModel;
module.exports.callModel = callModel;
