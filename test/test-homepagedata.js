'use strict';
// Copyright TXPCo ltd, 2020

if (typeof exports !== 'undefined') {

   var facilityModule = require('../common/facility.js');
   var Facility = facilityModule.Facility;

   var homepageModule = require('../common/homepagedata.js');
   var HomePageData = homepageModule.HomePageData;

   var typesModule = require('../common/types.js');
   var TypeRegistry = typesModule.TypeRegistry;

   var expect = require("chai").expect;
}

describe("HomePageData", function () {
   var page1, page2;
   var dummyFacility = new Facility("id", "extId", "TestFacilityName", "TestFacilityUrl", "TestFacilityUrl2");
   var facilities1 = new Array(1), facilities2 = new Array(0);
   facilities1[0] = dummyFacility; 
   
   beforeEach(function () {
      page1 = new HomePageData("Joe", "https://jo.pics.com", dummyFacility, facilities1);

      page2 = new HomePageData("Joe", "https://jo.pics.com", dummyFacility, facilities2);
   });
   
   it("Needs to compare for equality and inequality", function () {
      
      expect(page1).to.equal(page1);
      expect(page1).to.not.equal(page2);
   });
   
   it("Needs to correctly store attributes", function () {

      expect(page1.personName).to.equal("Joe");
      expect(page1.personThumbnailUrl).to.equal("https://jo.pics.com");
      expect(page1.currentFacility).to.equal(dummyFacility);
      expect(page1.facilities).to.deep.equal(facilities1);
   });
   
   it("Needs to save and restore to/from JSON", function () {
      
      var types = new TypeRegistry();
      var output = JSON.stringify(page1);

      var obj = types.reviveFromJSON(output);

      expect(page1.equals(obj)).to.equal(true);
   });
});

