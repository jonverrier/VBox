'use strict';
// Copyright TXPCo ltd, 2020

if (typeof exports !== 'undefined') {

   var callModule = require('../common/call.js');
   var Call = callModule.Call;
   var CallParticipant = callModule.CallParticipant;
   var CallOffer = callModule.CallOffer;
   var CallAnswer = callModule.CallAnswer;
   var CallIceCandidate = callModule.CallIceCandidate;

   var typesModule = require('../common/types.js');
   var TypeRegistry = typesModule.TypeRegistry;

   var expect = require("chai").expect;
}

describe("CallParticipant", function () {
   var callParticipant1, callParticipant2;

   beforeEach(function () {
      callParticipant1 = new CallParticipant("id", "facility", "person", "123");
      callParticipant2 = new CallParticipant("id", "12345", "agag", "123");
   });

   it("Needs to compare for equality and inequality", function () {

      expect(callParticipant1).to.equal(callParticipant1);
      expect(callParticipant1).to.not.equal(callParticipant2);
   });

   it("Needs to correctly store attributes", function () {

      expect(callParticipant1._id).to.equal("id");
      expect(callParticipant1.facilityId).to.equal("facility");
      expect(callParticipant1.personId).to.equal("person");
      expect(callParticipant1.sessionId).to.equal("123");
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new TypeRegistry();
      var output = JSON.stringify(callParticipant1);

      var obj = types.reviveFromJSON(output);

      expect(callParticipant1.equals(obj)).to.equal(true);
   });
});

describe("CallOffer", function () {
   var callerFrom, callerTo;
   var offer1, offer2;

   beforeEach(function () {
      callerFrom = new CallParticipant("id", "facility", "person", "123");
      callerTo = new CallParticipant("id", "12345", "agag", "123");
      offer1 = new CallOffer("id", callerFrom, callerTo, "offer1");
      offer2 = new CallOffer("id", callerTo, callerFrom, "offer2");
   });

   it("Needs to compare for equality and inequality", function () {

      expect(offer1).to.equal(offer1);
      expect(offer1).to.not.equal(offer2);
   });

   it("Needs to correctly store attributes", function () {

      expect(offer1._id).to.equal("id");
      expect(offer1.from.equals(callerFrom)).to.equal(true);
      expect(offer1.to.equals(callerTo)).to.equal(true);
      expect(offer1.offer).to.equal("offer1");
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new TypeRegistry();
      var output = JSON.stringify(offer1);

      var obj = types.reviveFromJSON(output);

      expect(offer1.equals(obj)).to.equal(true);
   });
});

describe("CallAnswer", function () {
   var callerFrom, callerTo;
   var answer1, answer2;

   beforeEach(function () {
      callerFrom = new CallParticipant("id", "facility", "person", "123");
      callerTo = new CallParticipant("id", "12345", "agag", "123");
      answer1 = new CallAnswer("id", callerFrom, callerTo, "answer1");
      answer2 = new CallAnswer("id", callerTo, callerFrom, "answer2");
   });

   it("Needs to compare for equality and inequality", function () {

      expect(answer1).to.equal(answer1);
      expect(answer1).to.not.equal(answer2);
   });

   it("Needs to correctly store attributes", function () {

      expect(answer1._id).to.equal("id");
      expect(answer1.from.equals(callerFrom)).to.equal(true);
      expect(answer1.to.equals(callerTo)).to.equal(true);
      expect(answer1.answer).to.equal("answer1");
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new TypeRegistry();
      var output = JSON.stringify(answer1);

      var obj = types.reviveFromJSON(output);

      expect(answer1.equals(obj)).to.equal(true);
   });
});

describe("CallIceCandidate", function () {
   var callerFrom, callerTo;
   var ice1, ice2;

   beforeEach(function () {
      callerFrom = new CallParticipant("id", "facility", "person", "123");
      callerTo = new CallParticipant("id", "12345", "agag", "123");
      ice1 = new CallIceCandidate("id", callerFrom, callerTo, "ice1");
      ice2 = new CallIceCandidate("id", callerTo, callerFrom, "ice2");
   });

   it("Needs to compare for equality and inequality", function () {

      expect(ice1).to.equal(ice1);
      expect(ice1).to.not.equal(ice2);
   });

   it("Needs to correctly store attributes", function () {

      expect(ice1._id).to.equal("id");
      expect(ice1.from.equals(callerFrom)).to.equal(true);
      expect(ice1.to.equals(callerTo)).to.equal(true);
      expect(ice1.ice).to.equal("ice1");
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new TypeRegistry();
      var output = JSON.stringify(ice1);

      var obj = types.reviveFromJSON(output);

      expect(ice1.equals(obj)).to.equal(true);
   });
});

describe("Call", function () {
   var class1, class2;
   var dummyClass = new Call("id", partipipantAddrs);
   var partipipantAddrs = new Array(1);
   partipipantAddrs[0] = "1.1.1.1"
   
   beforeEach(function () {
      class1 = new Call("id", "1234", partipipantAddrs);

      class2 = new Call("id", "1234", new Array());
   });
   
   it("Needs to compare for equality and inequality", function () {
      
      expect(class1).to.equal(class1);
      expect(class1).to.not.equal(class2);
   });
   
   it("Needs to correctly store attributes", function () {

      expect(class1._id).to.equal("id");
      expect(class1.facilityId).to.equal("1234");
      expect(class1.participants).to.deep.equal(partipipantAddrs);
   });
   
   it("Needs to save and restore to/from JSON", function () {
      
      var types = new TypeRegistry();
      var output = JSON.stringify(class1);

      var obj = types.reviveFromJSON(output);

      expect(class1.equals(obj)).to.equal(true);
   });
});

