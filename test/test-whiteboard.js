'use strict';

const { Person } = require('../common/person.js');

// Copyright TXPCo ltd, 2020

if (typeof exports !== 'undefined') {

   var whiteboardModule = require('../common/whiteboard.js');
   var Whiteboard = whiteboardModule.Whiteboard;

   var typesModule = require('../common/types.js');
   var TypeRegistry = typesModule.TypeRegistry;

   var expect = require("chai").expect;
}

describe("Whiteboard", function () {
   var person1, person2, whiteboard1, whiteboard2;
   
   beforeEach(function () {
      person1 = new Person(1, "123", "Joe", "Joe@mail.com", "https://jo.pics.com", "1234");
      person2 = new Person(2, "123", "Joe", "Joe@mail.com", "https://jo.pics.com", "5678");
      whiteboard1 = new Whiteboard(person1, person1);
      whiteboard2 = new Whiteboard(person1, person2);
   });
   
   it("Needs to compare for equality and inequality", function () {
      
      expect(whiteboard1).to.equal(whiteboard1);
      expect(whiteboard1).to.not.equal(whiteboard2);
   });
   
   it("Needs to correctly store attributes", function () {
      
      expect(whiteboard1.workout.equals(person1)).to.equal(true);    
      expect(whiteboard1.results.equals(person1)).to.equal(true);          
   });
   
   it("Needs to save and restore to/from JSON", function () {
      
      var types = new TypeRegistry();
      var output = JSON.stringify(whiteboard1);
      var obj = types.reviveFromJSON(output);

      expect(whiteboard1.equals(obj)).to.equal(true);
   });
});

