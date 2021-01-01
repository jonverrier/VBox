'use strict';
// Copyright TXPCo ltd, 2020

var express = require('express');
const bodyParser = require('body-parser');

// Core logic classes
var TypeRegistry = require('../common/types.js').TypeRegistry;
var CallKeepAlive = require("../common/call.js").CallKeepAlive;
var SignalMessage = require("../common/signal.js").SignalMessage;

// TODO - this is not very scalable, sequential array
var subscribers = new Array();

// Used to support message replay if client misses messages & needs to rejoin
var sequence = 0;

// Middleware for GET events endpoint
function eventFeed(req, res, next) {
   // Mandatory headers and http status to keep connection open
   const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
   };
   res.writeHead(200, headers);

   // Client passes call participant data as query 
   var types = new TypeRegistry();
   var callParticipation = types.reviveFromJSON(decodeURIComponent(req.query.callParticipation));

   // TODO - this is not very scalable, sequential array
   subscribers.push({ callParticipation: callParticipation, response: res });

   // This pushes the notice of the new participant over server-sent event channel
   broadcastNewParticipation(callParticipation);

   // When client closes connection we update the subscriber list
   // avoiding the disconnected one
   req.on('close', () => {
      // TODO - this is not very scalable, sequential array
      for (var i = 0; i < subscribers.length; i++)
         if (subscribers[i].callParticipation.sessionId === callParticipation.sessionId
            && subscribers[i].callParticipation.sessionSubId === callParticipation.sessionSubId) {
            subscribers.splice(i, 1);
            break;
         }
   });
}

// broadcast a keep alive message - required on Heroku
function broadcastKeepAlive() {
   const message = new SignalMessage(null, null, null, sequence, new CallKeepAlive(sequence));
   sequence = sequence + 1;

   // TODO - this is not very scalable, sequential array
   for (var i = 0; i < subscribers.length; i++)
      subscribers[i].response.write('data:' + JSON.stringify(message) + '\n\n');
}

setInterval((args) => {
   broadcastKeepAlive();
}, 1000 * 30, null);

// broadcast a new subscriber
function broadcastNewParticipation(callParticipation) {

   const message = new SignalMessage(null, null, null, sequence, callParticipation);
   sequence = sequence + 1;

   // TODO - this is not very scalable, sequential array
   for (var i = 0; i < subscribers.length; i++) {
      if (!(subscribers[i].callParticipation.sessionId === callParticipation.sessionId
         && subscribers[i].callParticipation.sessionSubId === callParticipation.sessionSubId)) {
         subscribers[i].response.write('data:' + JSON.stringify(message) + '\n\n');
      }
   }
}

// Deliver a new WebRTC item
function deliverOne(item) {
   const message = new SignalMessage(null, item.to.sessionId, item.to.sessionSubId, sequence, item);
   sequence = sequence + 1;

   // TODO - this is not very scalable, sequential array
   for (var i = 0; i < subscribers.length; i++)
      if (subscribers[i].callParticipation.sessionId === item.to.sessionId
         && subscribers[i].callParticipation.sessionSubId === item.to.sessionSubId)
         subscribers[i].response.write('data:' + JSON.stringify(message) + '\n\n');
}

// Deliver a new WebRTC offer
function deliverNewOffer (callOffer) {
   deliverOne(callOffer);
}

// Deliver a new WebRTC answer
function deliverNewAnswer(callAnswer) {
   deliverOne(callAnswer);
}

// Deliver a new WebRTC ICE candidate
function deliverNewIceCandidate(callIceCandidate) {
   deliverOne(callIceCandidate);
}

module.exports.eventFeed = eventFeed;
module.exports.broadcastNewParticipation = broadcastNewParticipation;
module.exports.deliverNewOffer = deliverNewOffer;
module.exports.deliverNewAnswer = deliverNewAnswer;
module.exports.deliverNewIceCandidate = deliverNewIceCandidate;