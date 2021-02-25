'use strict';
// Copyright TXPCo ltd, 2020, 2021

var mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
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
   email: { // Is not required, or unique, as we allow anonymous users via the meeting ID. 
      type: String,
      index: true,
      alias: '_email'
   },
   thumbnailUrl: {
      type: String,
      required: true,
      alias: '_thumbnailUrl'
   },
   lastAuthCode: {
      type: String,
      required: false,
      alias: '_lastAuthCode'
   }
},
{  // Enable timestamps for archival as we create pseudo users for anonymous guests joining on a meeting code.
      timestamps: true
});

const personModel = mongoose.model("Person", personSchema);

module.exports = personModel;
module.exports.personModel = personModel;