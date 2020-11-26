'use strict';
// Copyright TXPCo ltd, 2020

if (typeof exports !== 'undefined') {

   var onlineclassModule = require('../common/onlineclass.js');
   var OnlineClass = onlineclassModule.OnlineClass;

   var typesModule = require('../common/types.js');
   var TypeRegistry = typesModule.TypeRegistry;

   var expect = require("chai").expect;
}

describe("OnlineClass", function () {
   var class1, class2;
   var dummyClass = new OnlineClass("id", partipipantAddrs);
   var partipipantAddrs = new Array(1);
   partipipantAddrs[0] = "1.1.1.1"
   
   beforeEach(function () {
      class1 = new OnlineClass("id", "1234", partipipantAddrs);

      class2 = new OnlineClass("id", "1234", new Array());
   });
   
   it("Needs to compare for equality and inequality", function () {
      
      expect(class1).to.equal(class1);
      expect(class1).to.not.equal(class2);
   });
   
   it("Needs to correctly store attributes", function () {

      expect(class1._id).to.equal("id");
      expect(class1.facilityId).to.equal("1234");
      expect(class1.particpantChannels).to.deep.equal(partipipantAddrs);
   });
   
   it("Needs to save and restore to/from JSON", function () {
      
      var types = new TypeRegistry();
      var output = JSON.stringify(class1);

      var obj = types.reviveFromJSON(output);

      expect(class1.equals(obj)).to.equal(true);
   });
});

