'use strict';

var mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      index: true 
   },
   email: {
      type: String,
      required: true,
      index: true,
      unique : true
   },
   thumbnailUrl: {
      type: String,
      required: true
   },
   lastAuthCode: {
      type: String,
      required: false
   }
});

const personModel = mongoose.model("Person", personSchema);

module.exports = personModel;
