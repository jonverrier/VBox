'use strict';
// Copyright TXPCo ltd, 2020, 2021

// Core logic classes
var pkg = require('../dist/core-bundle.js');
var EntryPoints = pkg.default;
var StreamableTypes = EntryPoints.StreamableTypes;
var CallKeepAlive = EntryPoints.CallKeepAlive;
var SignalMessage = EntryPoints.SignalMessage;

var logger = new EntryPoints.LoggerFactory().createLogger(EntryPoints.ELoggerType.Server);

// Model for signalMessage
var SignalMessageModel = require("./signalmessage-model.js");

var facilityMap = new Map();

// Used to support message replay if client misses messages & needs to rejoin
var sequence = 0;

async function initialise() {
   // read the highest sequence number used so far
   // Use 'await so we can be sure this completes before signal messages start to arrive
   // which is a race condition
   const messages = await SignalMessageModel.find({}).sort({ sequenceNo: -1 }).limit(1).exec();

   if (messages.length > 0)
      sequence = messages[0].sequenceNo + 1;
}

// Middleware for GET events endpoint
function eventFeed(req, res, next) {
   // Mandatory headers and http status to keep connection open
   const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
      'transfer-encoding': 'chunked'
   };

   res.writeHead(200, headers);
   res.flush();

   // Client passes call participant data as query 
   var types = new StreamableTypes();
   var callParticipation = types.reviveFromJSON(decodeURIComponent(req.query.callParticipation));

   logger.logInfo('event-source', 'eventFeed', 'Subscription from :', callParticipation);

   if (!facilityMap.has(callParticipation.facilityId)) {

      logger.logInfo('event-source', 'eventFeed', 'new map :', callParticipation.facilityId);

      facilityMap.set(callParticipation.facilityId, new Array());

      // sets a keep alive going, specific to the facility
      setInterval(() => {
         broadcastKeepAlive(callParticipation.facilityId);
      }, 1000 * 30, null);
   } 

   facilityMap.get(callParticipation.facilityId).push({ callParticipation: callParticipation, response: res });

   var clientSequenceNo = types.reviveFromJSON(decodeURIComponent(req.query.sequenceNo));

   if (clientSequenceNo !== 0 && clientSequenceNo < sequence) {

      // Client is rejoining after a connection drop & needs to be brought back up to date
      // Normally would filter results for the right target in the query, but mongoose does not allow $or on strings, so we manually filter in the callback
      // Assume performance OK as its only signalling mssages being replayed & volume should not be too high. 
      // Marked with TODO for high volume cases (setting up calls for 10s of facilities concurrently ...)
      // sessionId: { $or: [{ $eq: null }, { $eq: callParticipation.sessionId } ] },       // Null (broadcast) or targeted to the client
      // sessionSubId: { $or: [{ $eq: null }, { $eq: callParticipation.sessionSubId } ] }, // Null (broadcast) or targeted to the client
      // facilityId: { facilityId } // Same facility as client
      
      SignalMessageModel.find({
            sequenceNo: { $gt: clientSequenceNo },       // Sequence numbers the client has not recieved                                
         },    
         function(err, messages) {
            var subscribers = facilityMap.get(callParticipation.facilityId);

            for (var i = 0; i < subscribers.length; i++) {
               if (subscribers[i].callParticipation.sessionId === callParticipation.sessionId
               && subscribers[i].callParticipation.sessionSubId === callParticipation.sessionSubId) {
                  for (let message of messages) {
                     if (message.facilityId === callParticipation.facilityId) {
                        subscribers[i].response.write('data:' + JSON.stringify(SignalMessage.fromStored(message)) + '\n\n');
                        subscribers[i].response.flush();
                     }
                  }
               }
            }
         });
   }

   // send a keep alive back to the joiner so they see the channel is working
   broadcastKeepAlive(callParticipation.facilityId);

   // This pushes the notice of the new participant over server-sent event channel
   broadcastNewParticipation(callParticipation);

   // When client closes connection we update the subscriber list
   // avoiding the disconnected one
   req.on('close', () => {
      var subscribers = facilityMap.get(callParticipation.facilityId);

      logger.logInfo('event-source', 'eventFeed', 'Closing subscription for:', callParticipation.facilityId);

      for (var i = 0; i < subscribers.length; i++)
         if (subscribers[i].callParticipation.sessionId === callParticipation.sessionId
            && subscribers[i].callParticipation.sessionSubId === callParticipation.sessionSubId) {
            subscribers.splice(i, 1);
            break;
         }
   });
}

// broadcast a keep alive message - required on Heroku
function broadcastKeepAlive(facilityId) {
   const message = new SignalMessage(null, facilityId, null, null, sequence, new CallKeepAlive(sequence));
   // Dont bother saving keep alive messages to the replay log - no functional purpose. 
   // sequence = sequence + 1;
   // new SignalMessageModel(SignalMessage.toStored(message)).save(); 

   var subscribers = facilityMap.get(facilityId);
   for (var i = 0; i < subscribers.length; i++) {
      logger.logInfo('event-source', 'broadcastKeepAlive', 'Writing to :', subscribers[i].callParticipation);
      logger.logInfo('event-source', 'broadcastKeepAlive', 'Writing :', JSON.stringify(message));
      subscribers[i].response.write('data:' + JSON.stringify(message) + '\n\n');
      subscribers[i].response.flush();
   }
}

// broadcast a new subscriber
function broadcastNewParticipation(callParticipation) {

   const message = new SignalMessage(null, callParticipation.facilityId, null, null, sequence, callParticipation);
   sequence = sequence + 1;
   new SignalMessageModel(SignalMessage.toStored(message)).save(); 

   var subscribers = facilityMap.get(callParticipation.facilityId);
   for (var i = 0; i < subscribers.length; i++) {
      // filter out 'new participation' messages so we don't send back to the same new joiner
      if (!(subscribers[i].callParticipation.sessionId === callParticipation.sessionId
         && subscribers[i].callParticipation.sessionSubId === callParticipation.sessionSubId)) {
         logger.logInfo('event-source', 'broadcastNewParticipation', 'Writing to :', subscribers[i].callParticipation);
         logger.logInfo('event-source', 'broadcastNewParticipation', 'Writing :', JSON.stringify(message));
         subscribers[i].response.write('data:' + JSON.stringify(message) + '\n\n');
         subscribers[i].response.flush();
      }
   }
}

// Deliver a new WebRTC item
function deliverOne(item) {
   const message = new SignalMessage(null, item.to.facilityId, item.to.sessionId, item.to.sessionSubId, sequence, item);
   sequence = sequence + 1;
   new SignalMessageModel(SignalMessage.toStored(message)).save(); 

   var subscribers = facilityMap.get(item.to.facilityId);
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