'use strict';
// Copyright TXPCo ltd, 2020

var express = require('express');
const bodyParser = require('body-parser');

// Core logic classes
var TypeRegistry = require('../common/types.js').TypeRegistry;
var CallKeepAlive = require("../common/call.js").CallKeepAlive;

// TODO - this is not very scalable, sequential array
var subscribers = new Array();

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
   var callParticipant = types.reviveFromJSON(decodeURIComponent (req.query.callParticipant));

   // TODO - this is not very scalable, sequential array
   subscribers.push({ callParticipant: callParticipant, response: res });

   // When client closes connection we update the subscriber list
   // avoiding the disconnected one
   req.on('close', () => {
      // TODO - this is not very scalable, sequential array
      for (var i = 0; i < subscribers.length; i++)
         if (subscribers[i].callParticipant.sessionId === callParticipant.sessionId)
            subscribers.splice(i, 1);
   });
}

// broadcast a keep lice message - required on Heroku
function broadcastKeepAlive() {
   const keepAlive = new CallKeepAlive(0);

   // TODO - this is not very scalable, sequential array
   for (var i = 0; i < subscribers.length; i++)
      subscribers[i].response.write('data:' + JSON.stringify(keepAlive) + '\n\n');
}

setInterval((args) => {
   broadcastKeepAlive();
}, 1000 * 30, null);

// broadcast a new subscriber
function broadcastNewParticipant(callParticipant) {
   // TODO - this is not very scalable, sequential array
   for (var i = 0; i < subscribers.length; i++)
      if (subscribers[i].callParticipant.personId === callParticipant.personId
      && subscribers[i].callParticipant.sessionId !== callParticipant.sessionId)
         subscribers[i].response.write('data:'+JSON.stringify(callParticipant)+'\n\n');
}


// Deliver a new WebTC offer
function deliverOne(item) {
   // TODO - this is not very scalable, sequential array
   for (var i = 0; i < subscribers.length; i++)
      if (subscribers[i].callParticipant.sessionId === item.to.sessionId)
         subscribers[i].response.write('data:' + JSON.stringify(item) + '\n\n');
}

// Deliver a new WebTC offer
function deliverNewOffer (callOffer) {
   deliverOne(callOffer);
}

// Deliver a new WebTC offer
function deliverNewAnswer(callAnswer) {
   deliverOne(callAnswer);
}

// Deliver a new WebTC ICE candidate
function deliverNewIceCandidate(callIceCandidate) {
   deliverOne(callIceCandidate);
}

module.exports.eventFeed = eventFeed;
module.exports.broadcastNewParticipant = broadcastNewParticipant;
module.exports.deliverNewOffer = deliverNewOffer;
module.exports.deliverNewAnswer = deliverNewAnswer;
module.exports.deliverNewIceCandidate = deliverNewIceCandidate;