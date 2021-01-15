'use strict';
// Copyright TXPCo ltd, 2020

var mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
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
   email: { // Is not required, or unique, as we allow anonymous users via the meeting ID. 
      type: String,
      index: true
   },
   thumbnailUrl: {
      type: String,
      required: true
   },
   lastAuthCode: {
      type: String,
      required: false
   }
},
{  // Enable timestamps for archival as we create pseudo users for anonymous guests joining on a meeting code.
      timestamps: true
});

const personModel = mongoose.model("Person", personSchema);

module.exports = personModel;
