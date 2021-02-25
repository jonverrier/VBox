'use strict';
// Copyright TXPCo ltd, 2020

var mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
   email: {
      type: String,
      required: true,
      index: true
   },   
   deletionRequest: {
      type: Boolean,
      retuired: false,
      index: true
   }
},
{  // Enable timestamps for archival 
      timestamps: true
});

const leadModel = mongoose.model("Lead", leadSchema);

module.exports = leadModel;
module.exports.leadModel = leadModel;