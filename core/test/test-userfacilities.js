'use strict';
// Copyright TXPCo ltd, 2020, 2021

var pkg = require('../dist/core-bundle.js');
var EntryPoints = pkg.default;
var TypeRegistry = EntryPoints.TypeRegistry;
var Person = EntryPoints.Person;
var Facility = EntryPoints.Facility;
var UserFacilities = EntryPoints.UserFacilities;

var expect = require("chai").expect;

describe("UserFacilities", function () {
   var page1, page2;
   var dummyPerson = new Person(null, "1234", "Joe", null, "https://jo.pics.com", null);
   var dummyFacility = new Facility("id", "extId", "TestFacilityName", "TestFacilityUrl", "TestFacilityUrl2");
   var facilities1 = new Array(1), facilities2 = new Array(0);
   facilities1[0] = dummyFacility; 
   
   beforeEach(function () {
      page1 = new UserFacilities("id1", dummyPerson, dummyFacility, facilities1);

      page2 = new UserFacilities("id2", dummyPerson, dummyFacility, facilities2);
   });
   
   it("Needs to compare for equality and inequality", function () {

      expect(page1).to.equal(page1);
      expect(page1).to.not.equal(page2);
   });
   
   it("Needs to correctly store attributes", function () {

      expect(page1.sessionId === "id1").to.equal(true);
      expect(page1.person.equals(dummyPerson)).to.equal(true);
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

