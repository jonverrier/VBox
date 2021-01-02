'use strict';
// Copyright TXPCo ltd, 2020

// Core logic classes
var TypeRegistry = require('../common/types.js').TypeRegistry;
var CallKeepAlive = require("../common/call.js").CallKeepAlive;
var SignalMessage = require("../common/signal.js").SignalMessage;

// Model for signalMessage
var SignalMessageModel = require("../server/signalmessage-model.js");

// TODO - this is not very scalable, sequential array
var subscribers = new Array();

// Used to support message replay if client misses messages & needs to rejoin
var sequence = 0;

// Used to change the payload to JSON before storage
function toStored(signalMessageIn) {
   return new SignalMessage(signalMessageIn._id,
      signalMessageIn.sessionId,
      signalMessageIn.sessionSubId,
      signalMessageIn.sequenceNo,
      JSON.stringify(signalMessageIn.data));
}

// Used to change the payload from JSON after storage
function fromStored(signalMessageIn) {
   return new SignalMessage(signalMessageIn._id,
      signalMessageIn.sessionId,
      signalMessageIn.sessionSubId,
      signalMessageIn.sequenceNo,
      SignalMessage.prototype.revive (signalMessageIn.data));
}

function initialise() {
   // read the highest sequence number used so far
   SignalMessageModel.find({}).sort({ sequenceNo: -1 }).limit(1).then(function (messages) {
      if (messages.length > 0)
         sequence = messages[0].sequenceNo + 1;
   });
}

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

   var clientSequenceNo = types.reviveFromJSON(decodeURIComponent(req.query.sequenceNo));
   if (clientSequenceNo !== 0 && clientSequenceNo < sequence) {

      // Client is rejoining after a connection drop & needs to be brought back up to date
      SignalMessageModel.find({ sequenceNo: { $and: [{ $gt: clientSequenceNo }, { $lte: sequence }] }, // Sequence numbers the client has not recieved
         sessionId: { $or: [{ $eq: null }, { $eq: callParticipation.sessionId } ] },       // Null (broadcast) or targeted to the client
         sessionSubId: { $or: [{ $eq: null }, { $eq: callParticipation.sessionSubId } ] }, // Null (broadcast) or targeted to the client
         facilityId: callParticipation.facilityId },                       // Same facilityId as the client

         function (err, messages) {
            // TODO - this is not very scalable, sequential array
            for (var i = 0; i < subscribers.length; i++)
               if (subscribers[i].callParticipation.sessionId === callParticipation.sessionId
                  && subscribers[i].callParticipation.sessionSubId === callParticipation.sessionSubId) {
                  for (let message of messages) {
                     subscribers[i].response.write('data:' + JSON.stringify(fromStored(message)) + '\n\n');
                  }
               }
         });
   }

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
   new SignalMessageModel(toStored(message)).save(); 

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
   new SignalMessageModel(toStored(message)).save(); 

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
   new SignalMessageModel(toStored(message)).save(); 

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

module.exports.initialise = initialise;
module.exports.eventFeed = eventFeed;
module.exports.broadcastNewParticipation = broadcastNewParticipation;
module.exports.deliverNewOffer = deliverNewOffer;
module.exports.deliverNewAnswer = deliverNewAnswer;
module.exports.deliverNewIceCandidate = deliverNewIceCandidate;