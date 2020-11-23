'use strict';
// Copyright TXPCo ltd, 2020

if (typeof exports !== 'undefined') {

   var facilityModule = require('../common/facility.js');
   var Facility = facilityModule.Facility;

   var typesModule = require('../common/types.js');
   var TypeRegistry = typesModule.TypeRegistry;

   var expect = require("chai").expect;
}


describe("Facility", function () {
   var facility1, facility2;
   
   beforeEach(function () {
      facility1 = new Facility(1, "123", "Fortitude", "https://Fortitude.pics.com");

      facility2 = new Facility(2, "123", "Fortitude", "https://Fortitude.pics.com");
   });
   
   it("Needs to compare for equality and inequality", function () {
      
      expect(facility1).to.equal(facility1);
      expect(facility1).to.not.equal(facility2);
   });
   
   it("Needs to correctly store attributes", function () {
      
      expect(facility1._id).to.equal(1);    
      expect(facility1.externalId).to.equal("123");      
      expect(facility1.name).to.equal("Fortitude");
      expect(facility1.thumbnailUrl).to.equal("https://Fortitude.pics.com");
   });
   
   it("Needs to save and restore to/from JSON", function () {
      
      var types = new TypeRegistry();
      var output = JSON.stringify(facility1);
      var obj = types.reviveFromJSON(output);

      expect(facility1.equals(obj)).to.equal(true);
   });
});

