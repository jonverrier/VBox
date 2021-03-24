'use strict';
// Copyright TXPCo ltd, 2020, 2021

// Core logic classes
var pkg = require('../dist/core-bundle.js');
var EntryPoints = pkg.default;

var logger = new EntryPoints.LoggerFactory().createLogger(EntryPoints.ELoggerType.Server);

const KJUR = require('jsrsasign')

var apiKey = process.env.ZOOM_API_KEY;
var apiSecret = process.env.ZOOM_API_SECRET;

// pass in Zoom topic and password 
function generateSignature(topic, password) {

   let signature = "";

   // try {
   const iat = Math.round(new Date().getTime() / 1000);
   const exp = iat + 60 * 60 * 2;

   // Header
   const oHeader = { alg: "HS256", typ: "JWT" };
   // Payload
   const oPayload = {
      app_key: apiKey,
      iat,
      exp,
      tpc: topic,
      pwd: password,
   };

   // Sign JWT
   const sHeader = JSON.stringify(oHeader);
   const sPayload = JSON.stringify(oPayload);
   signature = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, apiSecret);

   return signature;
}

module.exports.generateSignature = generateSignature;