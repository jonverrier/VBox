'use strict';
// Copyright TXPCo ltd, 2020, 2021

var pkg = require ('../dist/core-bundle.js');
var EntryPoints = pkg.default;

var expect = require("chai").expect;

describe("DateWithDays", function () {
   var person1, person2;
  
   
   it("Needs to return a weekday", function () {
      let date = new Date ("2021-02-22");
      expect(date.getWeekDay()).to.equal("Monday");
   });
   
});

