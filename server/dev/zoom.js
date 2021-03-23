'use strict';
// Copyright TXPCo ltd, 2020, 2021

// Core logic classes
var pkg = require('../dist/core-bundle.js');
var EntryPoints = pkg.default;

var logger = new EntryPoints.LoggerFactory().createLogger(EntryPoints.ELoggerType.Server);

const crypto = require('crypto') // crypto comes with Node.js

var apiKey = process.env.ZOOM_API_KEY;
var apiSecret = process.env.ZOOM_API_SECRET;

// pass in Zoom Meeting Number, and 0 to join meeting or webinar or 1 to start meeting
function generateSignature(meetingNumber, role) {

   // Prevent time sync issue between client signature generation and zoom 
   const timestamp = new Date().getTime() - 30000
   const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64')
   const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64')
   const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64')

   return signature
}

module.exports.generateSignature = generateSignature;