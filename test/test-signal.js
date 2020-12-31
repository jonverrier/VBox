'use strict';
// Copyright TXPCo ltd, 2020

if (typeof exports !== 'undefined') {

   var callModule = require('../common/call.js');
   var CallParticipation = callModule.CallParticipation;
   var CallKeepAlive = callModule.CallKeepAlive;
   var CallIceCandidate = callModule.CallIceCandidate;
   var CallOffer = callModule.CallOffer;
   var CallAnswer = callModule.CallAnswer;
   var signalModule = require('../common/signal.js');
   var SignalMessage = signalModule.SignalMessage;

   var typesModule = require('../common/types.js');
   var TypeRegistry = typesModule.TypeRegistry;

   var expect = require("chai").expect;
}

describe("SignalMessage", function () {
   var callParticipation, callKeepAlive, callIce, callOffer, callAnswer,
      signalMessageParticipant, signalMessage2, signalMessageKeepAlive, signalMessageIce, signalMessageOffer, signalMessageAnswer;

   beforeEach(function () {
      callParticipation = new CallParticipation("id", "facilityId", "personId", "sessionId");
      callKeepAlive = new CallKeepAlive("id");
      callIce = new CallIceCandidate("id", callParticipation, callParticipation, "ice1", true);
      callOffer = new CallOffer("id", callParticipation, callParticipation, "offer1");
      callAnswer = new CallAnswer("id", callParticipation, callParticipation, "answer1");

      signalMessageParticipant = new SignalMessage("id", "sessionId", 0, callParticipation);
      signalMessage2 = new SignalMessage("id", "12345", 1, callParticipation);
      signalMessageKeepAlive = new SignalMessage("id", "12345", 1, callKeepAlive);
      signalMessageIce = new SignalMessage("id", "12345", 1, callIce);
      signalMessageOffer = new SignalMessage("id", "12345", 1, callOffer);
      signalMessageAnswer = new SignalMessage("id", "12345", 1, callAnswer);
   });

   it("Needs to compare for equality and inequality", function () {

      expect(signalMessageParticipant).to.equal(signalMessageParticipant);
      expect(signalMessageParticipant).to.not.equal(signalMessage2);
   });

   it("Needs to correctly store attributes", function () {

      expect(signalMessageParticipant._id).to.equal("id");
      expect(signalMessageParticipant.sessionId).to.equal("sessionId");
      expect(signalMessageParticipant.sequenceNo).to.equal(0);
      expect(signalMessageParticipant.data.equals(callParticipation)).to.equal(true);
   });

   it("Needs to save and restore to/from JSON with a CallParticipation", function () {

      var types = new TypeRegistry();
      var output = JSON.stringify(signalMessageParticipant);

      var obj = types.reviveFromJSON(output);

      expect(signalMessageParticipant.equals(obj)).to.equal(true);
   });

   it("Needs to save and restore to/from JSON with a CallKeepAlive", function () {

      var types = new TypeRegistry();
      var output = JSON.stringify(signalMessageKeepAlive);

      var obj = types.reviveFromJSON(output);
      expect(signalMessageKeepAlive.equals(obj)).to.equal(true);
   });

   it("Needs to save and restore to/from JSON with a CallIce", function () {

      var types = new TypeRegistry();
      var output = JSON.stringify(signalMessageIce);

      var obj = types.reviveFromJSON(output);
      expect(signalMessageIce.equals(obj)).to.equal(true);
   });

   it("Needs to save and restore to/from JSON with a CallOffer", function () {

      var types = new TypeRegistry();
      var output = JSON.stringify(signalMessageOffer);

      var obj = types.reviveFromJSON(output);
      expect(signalMessageOffer.equals(obj)).to.equal(true);
   });

   it("Needs to save and restore to/from JSON with a CallAnswer", function () {

      var types = new TypeRegistry();
      var output = JSON.stringify(signalMessageAnswer);

      var obj = types.reviveFromJSON(output);
      expect(signalMessageAnswer.equals(obj)).to.equal(true);
   });
});

