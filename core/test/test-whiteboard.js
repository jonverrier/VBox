'use strict';
// Copyright TXPCo ltd, 2020, 2021

var pkg = require('../dist/core-bundle.js');
var EntryPoints = pkg.default;
var StreamableTypes = EntryPoints.StreamableTypes;
var WhiteboardElement = EntryPoints.WhiteboardElement;
var Whiteboard = EntryPoints.Whiteboard;

var expect = require("chai").expect;

describe("WhiteboardElement", function () {
   var person1, person2, element1, element2;

   beforeEach(function () {
      element1 = new WhiteboardElement(1, "text");
      element2 = new WhiteboardElement(2, "text\ntext");
   });

   it("Needs to compare for equality and inequality", function () {

      expect(element1).to.equal(element1);
      expect(element1).to.not.equal(element2);
   });

   it("Needs to correctly store attributes", function () {

      expect(element1.rows === 1).to.equal(true);
      expect(element1.text === 'text').to.equal(true);
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new StreamableTypes();
      var output = JSON.stringify(element1);

      var obj = types.reviveFromJSON(output);
      expect(element1.equals(obj)).to.equal(true);
   });
});

describe("Whiteboard", function () {
   var element1, element2, whiteboard1, whiteboard2;
   
   beforeEach(function () {
      element1 = new WhiteboardElement(1, "text");
      element2 = new WhiteboardElement(2, "text\ntext");
      whiteboard1 = new Whiteboard(element1, element1);
      whiteboard2 = new Whiteboard(element1, element2);
   });
   
   it("Needs to compare for equality and inequality", function () {
      
      expect(whiteboard1).to.equal(whiteboard1);
      expect(whiteboard1).to.not.equal(whiteboard2);
   });
   
   it("Needs to correctly store attributes", function () {
      
      expect(whiteboard1.workout.equals(element1)).to.equal(true);    
      expect(whiteboard1.results.equals(element1)).to.equal(true);          
   });
   
   it("Needs to save and restore to/from JSON", function () {
      
      var types = new StreamableTypes();
      var output = JSON.stringify(whiteboard1);
      var obj = types.reviveFromJSON(output);

      expect(whiteboard1.equals(obj)).to.equal(true);
   });
});

