'use strict';
// Copyright TXPCo ltd, 2020, 2021

var pkg = require('../dist/core-bundle.js');
var EntryPoints = pkg.default;
var CallParticipation = EntryPoints.CallParticipation;
var CallParticipation = EntryPoints.CallParticipation;
var CallOffer = EntryPoints.CallOffer;
var CallAnswer = EntryPoints.CallAnswer;
var CallIceCandidate = EntryPoints.CallIceCandidate;
var CallLeaderResolve = EntryPoints.CallLeaderResolve;
var CallKeepAlive = EntryPoints.CallKeepAlive;
var TypeRegistry = EntryPoints.TypeRegistry;

var expect = require("chai").expect;

describe("CallParticipation", function () {
   var callParticipation1, callParticipation2;

   beforeEach(function () {
      callParticipation1 = new CallParticipation("id", "facility", "person", true, "123", "xx");
      callParticipation2 = new CallParticipation("id", "12345", "agag", false, "123", "yy");
   });

   it("Needs to compare for equality and inequality", function () {

      expect(callParticipation1).to.equal(callParticipation1);
      expect(callParticipation1).to.not.equal(callParticipation2);
   });

   it("Needs to correctly store attributes", function () {

      expect(callParticipation1._id).to.equal("id");
      expect(callParticipation1.facilityId).to.equal("facility");
      expect(callParticipation1.personId).to.equal("person");
      expect(callParticipation1.isCandidateLeader).to.equal(true);
      expect(callParticipation1.sessionId).to.equal("123");
      expect(callParticipation1.sessionSubId).to.equal("xx");
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new TypeRegistry();
      var output = JSON.stringify(callParticipation1);

      var obj = types.reviveFromJSON(output);

      expect(callParticipation1.equals(obj)).to.equal(true);
   });
});

describe("CallOffer", function () {
   var callerFrom, callerTo;
   var offer1, offer2;

   beforeEach(function () {
      callerFrom = new CallParticipation("id", "facility", "person", false, "123", "xx");
      callerTo = new CallParticipation("id", "12345", "agag", false, "123", "yy");
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
      callerFrom = new CallParticipation("id", "facility", "person", false, "123", "xx");
      callerTo = new CallParticipation("id", "12345", "agag", false, "123");
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
   var ice1, ice2, iceNull;

   beforeEach(function () {
      callerFrom = new CallParticipation("id", "facility", "person", false, "123", "xx");
      callerTo = new CallParticipation("id", "12345", "agag", false, "123", "yy");
      ice1 = new CallIceCandidate("id", callerFrom, callerTo, "ice1", true);
      ice2 = new CallIceCandidate("id", callerTo, callerFrom, "ice2", false);
      iceNull = new CallIceCandidate("id", callerTo, callerFrom, null, false);
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
      expect(ice1.outbound).to.equal(true);
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new TypeRegistry();
      var output = JSON.stringify(ice1);

      var obj = types.reviveFromJSON(output);

      expect(ice1.equals(obj)).to.equal(true);
   });

   it("Needs to save and restore to/from JSON with a null ICE", function () {

      var types = new TypeRegistry();
      var output = JSON.stringify(iceNull);

      var obj = types.reviveFromJSON(output);

      expect(iceNull.equals(obj)).to.equal(true);
   });
});

describe("CallLeaderResolve", function () {
   var resolve1, resolve2;

   beforeEach(function () {
      resolve1 = new CallLeaderResolve("id");
      resolve2 = new CallLeaderResolve("id2");
   });

   it("Needs to compare for equality and inequality", function () {

      expect(resolve1).to.equal(resolve1);
      expect(resolve1).to.not.equal(resolve2);
   });

   it("Needs to correctly store attributes", function () {

      expect(resolve1._id).to.equal("id");
      expect(resolve1.glareResolve).to.not.equal(null);

   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new TypeRegistry();
      var output = JSON.stringify(resolve1);

      var obj = types.reviveFromJSON(output);
      expect(resolve1.equals(obj)).to.equal(true);
   });
});

describe("CallKeepAlive", function () {
   var keep1, keep2;

   beforeEach(function () {
      keep1 = new CallKeepAlive("id");
      keep2 = new CallKeepAlive("id2");
   });

   it("Needs to compare for equality and inequality", function () {

      expect(keep1).to.equal(keep1);
      expect(keep1).to.not.equal(keep2);
   });

   it("Needs to correctly store attributes", function () {

      expect(keep1._id).to.equal("id");
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new TypeRegistry();
      var output = JSON.stringify(keep1);

      var obj = types.reviveFromJSON(output);

      expect(keep1.equals(obj)).to.equal(true);
   });
});
