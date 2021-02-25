'use strict';
// Copyright TXPCo ltd, 2020

var pkg = require ('../dist/core-bundle.js');
var EntryPoints = pkg.default;
var QueueString = EntryPoints.QueueString;

var expect = require("chai").expect;

describe("Queue", function () {
  
   
   it("returns empty when initialised.", function () {
      
      let queue = new QueueString();
      expect(queue.peek()).to.equal(undefined); 
   });
   
   it("Enqueues & dequeues single item.", function () {

      let queue = new QueueString();
      queue.enqueue("One");
      expect(queue.peek()).to.equal("One");
      queue.dequeue();
      expect(queue.peek()).to.equal(undefined); 
   });
   
   it("Enqueues & dequeues multiple items.", function () {

      let queue = new QueueString();
      queue.enqueue("One");
      queue.enqueue("Two");
      expect(queue.peek()).to.equal("One");
      queue.dequeue();
      expect(queue.peek()).to.equal("Two");
   });
});

