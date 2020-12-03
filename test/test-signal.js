'use strict';
// Copyright TXPCo ltd, 2020

if (typeof exports !== 'undefined') {

   var callModule = require('../common/call.js');
   var CallParticipant = callModule.CallParticipant;
   var signalModule = require('../common/signal.js');
   var SignalMessage = signalModule.SignalMessage;

   var typesModule = require('../common/types.js');
   var TypeRegistry = typesModule.TypeRegistry;

   var expect = require("chai").expect;
}

describe("SignalMessage", function () {
   var callParticipant, signalMessage1, signalMessage2;

   beforeEach(function () {
      callParticipant = new CallParticipant("id", "facilityId", "personId", "sessionId");
      signalMessage1 = new SignalMessage("id", "sessionId", 0, callParticipant);
      signalMessage2 = new SignalMessage("id", "12345", 1, callParticipant);
   });

   it("Needs to compare for equality and inequality", function () {

      expect(signalMessage1).to.equal(signalMessage1);
      expect(signalMessage1).to.not.equal(signalMessage2);
   });

   it("Needs to correctly store attributes", function () {

      expect(signalMessage1._id).to.equal("id");
      expect(signalMessage1.sessionId).to.equal("sessionId");
      expect(signalMessage1.sequenceNo).to.equal(0);
      expect(signalMessage1.data.equals(callParticipant)).to.equal(true);
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new TypeRegistry();
      var output = JSON.stringify(signalMessage1);

      var obj = types.reviveFromJSON(output);

      expect(signalMessage1.equals(obj)).to.equal(true);
   });
});

