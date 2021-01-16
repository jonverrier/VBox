'use strict';
// Copyright TXPCo ltd, 2020

if (typeof exports !== 'undefined') {

   var clockModule = require('../common/workout-clock.js');
   var WorkoutClockSpec = clockModule.WorkoutClockSpec;
   var WorkoutClock = clockModule.WorkoutClock;
   var expect = require("chai").expect;
}


describe("WorkoutClockSpec", function () {
   var spec1, spec2, spec3;
   
   beforeEach(function () {
      spec1 = new WorkoutClockSpec(); 
      spec1.setCountUp(20);

      spec2 = new WorkoutClockSpec();
      spec2.setCountDown(20);

      spec3 = new WorkoutClockSpec();
      spec3.setInterval(4, 3, 1);
   });
   
   it("Needs to compare for equality and inequality", function () {
      
      expect(spec1.equals(spec1)).to.equal(true);
      expect(spec1.equals(spec2)).to.equal(false);
   });
   
   it("Needs to correctly store attributes", function () {
        
      expect(spec1.countTo).to.equal(20);      
      expect(spec3.intervals).to.equal(4); 
      expect(spec3.period1).to.equal(3); 
      expect(spec3.period2).to.equal(1); 
   });
});

describe("WorkoutClock", function () {
   var spec1, spec2, spec3, spec4;
   var timer1, timer2, timer3, timer4;

   beforeEach(function () {
      spec1 = new WorkoutClockSpec();
      spec1.setCountUp(20);
      timer1 = new WorkoutClock(spec1);

      spec2 = new WorkoutClockSpec();
      spec2.setCountUp(20);
      timer2 = new WorkoutClock(spec2);

      spec3 = new WorkoutClockSpec();
      spec3.setCountDown(20);
      timer3 = new WorkoutClock(spec3);

      spec4 = new WorkoutClockSpec();
      spec4.setInterval(4, 3, 1);
      timer4 = new WorkoutClock(spec4);
   });

   // These are all simple-minded tests - they just test that after a gap of 3 seconds, the clock is correct. 
   it("Needs to tick as wall clock", function () {
      timer1.start(null, null);
      var now = new Date();

      setTimeout(function () {
         var seconds = (now.getTime() - timer1.getStartTime()) / 1000;
         expect(seconds >= 3).to.equal(true);
      }, 3000);
   });

   it("Needs to tick as count up clock", function () {
      timer1.start(null, null);
      var now = new Date();

      setTimeout(function () {
         var seconds = timer1.ss;
         expect(seconds === '03' || seconds === '04').to.equal(true);
      }, 3000);
   });

   it("Needs to tick as count dowm clock", function () {
      timer1.start(null, null);
      var now = new Date();

      setTimeout(function () {
         var seconds = timer1.ss;
         expect(seconds === '56' || seconds === '57').to.equal(true);
      }, 3000);
   });

   it("Needs to tick as interval clock", function () {
      timer1.start(null, null);
      var now = new Date();

      setTimeout(function () {
         var seconds = timer1.ss;
         expect(seconds === '03' || seconds === '04').to.equal(true);
      }, 3000);
   });
});