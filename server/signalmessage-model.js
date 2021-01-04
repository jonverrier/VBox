'use strict';
// Copyright TXPCo ltd, 2020

var mongoose = require("mongoose");

const signalMessageSchema = new mongoose.Schema({
   facilityId: { 
      type: String,
      index: true
   },
   sessionId: { // can be null - which means a broadcast
      type: String, 
      index: true
   },
   sessionSubId: { // can be null - which means a broadcast
      type: String,
      index: true 
   },
   sequenceNo: {
      type: Number,
      required: true,
      index: true,
      unique : true
   },
   // Stores the payload as JSON to avoid multiple nested schemas for each type of payload
   data: {
      type: String,
      required: true
   }
},
{  // Enable timestamps for archival since signal messages are useless after the session ends. 
   timestamps: true
});

const signalMessageModel = mongoose.model("SignalMessage", signalMessageSchema);

module.exports = signalMessageModel;
