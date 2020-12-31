'use strict';
// Copyright TXPCo ltd, 2020

var mongoose = require("mongoose");

const callSchema = new mongoose.Schema({
   facilityId: {
      type: String,
      required: true,
      index: true
   }

   // TODO - class data such as whitebaord, clock, results etc needs to be stored here in case coach app crashes / is closed. 
});


const callModel = mongoose.model("call", callSchema);
module.exports.callModel = callModel;
