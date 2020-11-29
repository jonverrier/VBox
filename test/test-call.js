'use strict';
// Copyright TXPCo ltd, 2020

if (typeof exports !== 'undefined') {

   var callModule = require('../common/call.js');
   var Call = callModule.Call;
   var CallParticipant = callModule.CallParticipant;

   var typesModule = require('../common/types.js');
   var TypeRegistry = typesModule.TypeRegistry;

   var expect = require("chai").expect;
}

describe("CallParticipant", function () {
   var callParticipant1, callParticipant2;

   beforeEach(function () {
      callParticipant1 = new CallParticipant("id", "facility", "person");
      callParticipant2 = new CallParticipant("id", "12345", "agag");
   });

   it("Needs to compare for equality and inequality", function () {

      expect(callParticipant1).to.equal(callParticipant1);
      expect(callParticipant1).to.not.equal(callParticipant2);
   });

   it("Needs to correctly store attributes", function () {

      expect(callParticipant1._id).to.equal("id");
      expect(callParticipant1.facilityId).to.equal("facility");
      expect(callParticipant1.personId).to.equal("person");
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new TypeRegistry();
      var output = JSON.stringify(callParticipant1);

      var obj = types.reviveFromJSON(output);

      expect(callParticipant1.equals(obj)).to.equal(true);
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

