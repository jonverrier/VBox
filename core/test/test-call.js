'use strict';
// Copyright TXPCo ltd, 2020, 2021

var pkg = require('../dist/core-bundle.js');
var EntryPoints = pkg.default;
var ETransportType = EntryPoints.ETransportType;
var CallParticipation = EntryPoints.CallParticipation;
var CallOffer = EntryPoints.CallOffer;
var CallAnswer = EntryPoints.CallAnswer;
var CallIceCandidate = EntryPoints.CallIceCandidate;
var CallLeaderResolve = EntryPoints.CallLeaderResolve;
var CallData = EntryPoints.CallData;
var CallDataBatched = EntryPoints.CallDataBatched;
var CallKeepAlive = EntryPoints.CallKeepAlive;
var StreamableTypes = EntryPoints.StreamableTypes;

var expect = require("chai").expect;

describe("CallParticipation", function () {
   var callParticipation1, callParticipation2;

   beforeEach(function () {
      callParticipation1 = new CallParticipation("1234567890", "sess1", true);
      callParticipation2 = new CallParticipation("1234567890", "sess2", false);
   });

   it("Needs to compare for equality and inequality", function () {

      expect(callParticipation1).to.equal(callParticipation1);
      expect(callParticipation1).to.not.equal(callParticipation2);
   });

   it("Needs to correctly store attributes", function () {

      expect(callParticipation1.meetingId).to.equal("1234567890");
      expect(callParticipation1.sessionSubId).to.equal("sess1");
      expect(callParticipation1.isCandidateLeader).to.equal(true);
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new StreamableTypes();
      var output = JSON.stringify(callParticipation1);

      var obj = types.reviveFromJSON(output);

      expect(callParticipation1.equals(obj)).to.equal(true);
   });
});

describe("CallOffer", function () {
   var callerFrom, callerTo;
   var offer1, offer2;

   beforeEach(function () {
      callerFrom = new CallParticipation("1234567890", "sess1", true);
      callerTo = new CallParticipation("1234567890", "sess2", false);
      offer1 = new CallOffer(callerFrom, callerTo, "offer1", ETransportType.Rtc);
      offer2 = new CallOffer(callerTo, callerFrom, "offer2", ETransportType.Rtc);
   });

   it("Needs to compare for equality and inequality", function () {

      expect(offer1).to.equal(offer1);
      expect(offer1).to.not.equal(offer2);
   });

   it("Needs to correctly store attributes", function () {

      expect(offer1.from.equals(callerFrom)).to.equal(true);
      expect(offer1.to.equals(callerTo)).to.equal(true);
      expect(offer1.offer).to.equal("offer1");
      expect(offer1.transport).to.equal(ETransportType.Rtc);
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new StreamableTypes();
      var output = JSON.stringify(offer1);

      var obj = types.reviveFromJSON(output);

      expect(offer1.equals(obj)).to.equal(true);
   });
});

describe("CallAnswer", function () {
   var callerFrom, callerTo;
   var answer1, answer2;

   beforeEach(function () {
      callerFrom = new CallParticipation("1234567890", "sess1", true);
      callerTo = new CallParticipation("1234567890", "sess2", false);
      answer1 = new CallAnswer(callerFrom, callerTo, "answer1", ETransportType.Rtc);
      answer2 = new CallAnswer(callerTo, callerFrom, "answer2", ETransportType.Rtc);
   });

   it("Needs to compare for equality and inequality", function () {

      expect(answer1).to.equal(answer1);
      expect(answer1).to.not.equal(answer2);
   });

   it("Needs to correctly store attributes", function () {

      expect(answer1.from.equals(callerFrom)).to.equal(true);
      expect(answer1.to.equals(callerTo)).to.equal(true);
      expect(answer1.answer).to.equal("answer1");
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new StreamableTypes();
      var output = JSON.stringify(answer1);

      var obj = types.reviveFromJSON(output);

      expect(answer1.equals(obj)).to.equal(true);
   });
});

describe("CallIceCandidate", function () {
   var callerFrom, callerTo;
   var ice1, ice2, iceNull;

   beforeEach(function () {
      callerFrom = new CallParticipation("1234567890", "sess1", true);
      callerTo = new CallParticipation("1234567890", "sess2", false);
      ice1 = new CallIceCandidate(callerFrom, callerTo, "ice1", true);
      ice2 = new CallIceCandidate(callerTo, callerFrom, "ice2", false);
      iceNull = new CallIceCandidate(callerTo, callerFrom, null, false);
   });

   it("Needs to compare for equality and inequality", function () {

      expect(ice1).to.equal(ice1);
      expect(ice1).to.not.equal(ice2);
   });

   it("Needs to correctly store attributes", function () {

      expect(ice1.from.equals(callerFrom)).to.equal(true);
      expect(ice1.to.equals(callerTo)).to.equal(true);
      expect(ice1.ice).to.equal("ice1");
      expect(ice1.outbound).to.equal(true);
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new StreamableTypes();
      var output = JSON.stringify(ice1);

      var obj = types.reviveFromJSON(output);

      expect(ice1.equals(obj)).to.equal(true);
   });

   it("Needs to save and restore to/from JSON with a null ICE", function () {

      var types = new StreamableTypes();
      var output = JSON.stringify(iceNull);

      var obj = types.reviveFromJSON(output);

      expect(iceNull.equals(obj)).to.equal(true);
   });
});

describe("CallLeaderResolve", function () {
   var resolve1, resolve2;

   beforeEach(function () {
      resolve1 = new CallLeaderResolve();
      resolve2 = new CallLeaderResolve();
   });

   it("Needs to compare for equality and inequality", function () {

      expect(resolve1).to.equal(resolve1);
      expect(resolve1).to.not.equal(resolve2);
   });

   it("Needs to correctly store attributes", function () {

      expect(resolve1.glareResolve).to.not.equal(null);

   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new StreamableTypes();
      var output = JSON.stringify(resolve1);

      var obj = types.reviveFromJSON(output);
      expect(resolve1.equals(obj)).to.equal(true);
   });
});

describe("CallKeepAlive", function () {
   var keep1, keep2;

   beforeEach(function () {
      keep1 = new CallKeepAlive(1);
      keep2 = new CallKeepAlive(2);
   });

   it("Needs to compare for equality and inequality", function () {

      expect(keep1).to.equal(keep1);
      expect(keep1).to.not.equal(keep2);
   });

   it("Needs to correctly store attributes", function () {

      expect(keep1.sequenceNo).to.equal(1);
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new StreamableTypes();
      var output = JSON.stringify(keep1);

      var obj = types.reviveFromJSON(output);

      expect(keep1.equals(obj)).to.equal(true);
   });
});

describe("CallOffer", function () {
   var callerFrom, callerTo;
   var offer1, offer2;

   beforeEach(function () {
      callerFrom = new CallParticipation("1234567890", "sess1", true);
      callerTo = new CallParticipation("1234567890", "sess2", false);
      offer1 = new CallOffer(callerFrom, callerTo, "offer1", ETransportType.Rtc);
      offer2 = new CallOffer(callerTo, callerFrom, "offer2", ETransportType.Rtc);
   });

   it("Needs to compare for equality and inequality", function () {

      expect(offer1).to.equal(offer1);
      expect(offer1).to.not.equal(offer2);
   });

   it("Needs to correctly store attributes", function () {

      expect(offer1.from.equals(callerFrom)).to.equal(true);
      expect(offer1.to.equals(callerTo)).to.equal(true);
      expect(offer1.offer).to.equal("offer1");
      expect(offer1.transport).to.equal(ETransportType.Rtc);
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new StreamableTypes();
      var output = JSON.stringify(offer1);

      var obj = types.reviveFromJSON(output);

      expect(offer1.equals(obj)).to.equal(true);
   });
});

describe("CallData", function () {
   var callerFrom, callerTo;
   var data1, data2;

   beforeEach(function () {
      callerFrom = new CallParticipation("1234567890", "sess1", true);
      callerTo = new CallParticipation("1234567890", "sess2", false);
      data1 = new CallData(callerFrom, callerTo, "data1");
      data2 = new CallData(callerTo, callerFrom, "data2");
   });

   it("Needs to compare for equality and inequality", function () {

      expect(data1).to.equal(data1);
      expect(data1).to.not.equal(data2);
   });

   it("Needs to correctly store attributes", function () {

      expect(data1.from.equals(callerFrom)).to.equal(true);
      expect(data1.to.equals(callerTo)).to.equal(true);
      expect(data1.data).to.equal("data1");
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new StreamableTypes();
      var output = JSON.stringify(data1);

      var obj = types.reviveFromJSON(output);

      expect(data1.equals(obj)).to.equal(true);
   });
});

describe("CallDataBatched", function () {
   var callerFrom, callerTo, arr;
   var data1, data2;

   beforeEach(function () {
      callerFrom = new CallParticipation("1234567890", "sess1", true);
      callerTo = new CallParticipation("1234567890", "sess2", false);
      arr = new Array();
      arr.push(callerTo);
      arr.push(callerFrom);

      data1 = new CallDataBatched(callerFrom, arr, "data1");
      data2 = new CallDataBatched(callerTo, arr, "data2");
   });

   it("Needs to compare for equality and inequality", function () {

      expect(data1).to.equal(data1);
      expect(data1).to.not.equal(data2);
   });

   it("Needs to correctly store attributes", function () {

      expect(data1.from.equals(callerFrom)).to.equal(true);
      expect(data1.to === arr).to.equal(true);
      expect(data1.data).to.equal("data1");
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new StreamableTypes();
      var output = JSON.stringify(data1);

      var obj = types.reviveFromJSON(output);
      expect(data1.equals(obj)).to.equal(true);
   });
});