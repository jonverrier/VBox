'use strict';
// Copyright TXPCo ltd, 2020

if (typeof exports !== 'undefined') {

   var clockModule = require('../common/gymclock.js');
   var gymClockBeepType = clockModule.gymClockBeepType;
   var GymClockSpec = clockModule.GymClockSpec;
   var GymClock = clockModule.GymClock;
   var GymClockTick = clockModule.GymClockTick;
   var GymClockBeep = clockModule.GymClockBeep;
   var typesModule = require('../common/types.js');
   var TypeRegistry = typesModule.TypeRegistry;

   var expect = require("chai").expect;
}

describe("GymClockSpec", function () {
   var spec1, spec2, spec3, spec4;
   var now = new Date();
   
   beforeEach(function () {
      spec1 = new GymClockSpec(); 
      spec1.setCountUp(20);

      spec2 = new GymClockSpec();
      spec2.setCountDown(20);

      spec3 = new GymClockSpec();
      spec3.setInterval(4, 3, 1);

      spec4 = new GymClockSpec();
      spec4.setWall(new Date());
   });

   it("Needs to confirm validity of inputs", function () {

      // Wall clock validation
      expect(spec1.isValidWallSpec(now)).to.equal(true);
      expect(spec1.isValidWallSpec(new Date(1970, 12, 1, 0, 0, 0, 0))).to.equal(false);

      // CountUp validation
      expect(spec1.isValidCountUpSpec(20)).to.equal(true);
      expect(spec1.isValidCountUpSpec(61)).to.equal(false);
      expect(spec1.isValidCountUpSpec(0)).to.equal(false);

      // CountDown validation
      expect(spec1.isValidCountDownSpec(20)).to.equal(true);
      expect(spec1.isValidCountDownSpec(61)).to.equal(false);
      expect(spec1.isValidCountDownSpec(0)).to.equal(false);

      // Interval validation
      expect(spec1.isValidIntervalSpec(3, 3, 2)).to.equal(true);
      expect(spec1.isValidIntervalSpec(3, 3, 0)).to.equal(true);
      expect(spec1.isValidIntervalSpec(0, 3, 2)).to.equal(false);
      expect(spec1.isValidIntervalSpec(3, 0, 2)).to.equal(false);
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

   it("Needs to save and restore to/from JSON", function () {

      var types = new TypeRegistry();
      var output = JSON.stringify(spec1);

      var obj = types.reviveFromJSON(output);
      expect(obj.equals(spec1)).to.equal(true);
   });
});

describe("GymClock", function () {
   var spec1, spec2, spec3, spec4;
   var timer1, timer2, timer3, timer4;

   beforeEach(function () {
      spec1 = new GymClockSpec();
      spec1.setWall(new Date());
      timer1 = new GymClock(spec1);

      spec2 = new GymClockSpec();
      spec2.setCountUp(20);
      timer2 = new GymClock(spec2);

      spec3 = new GymClockSpec();
      spec3.setCountDown(20);
      timer3 = new GymClock(spec3);

      spec4 = new GymClockSpec();
      spec4.setInterval(4, 3, 1);
      timer4 = new GymClock(spec4);
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

describe("GymClockTick", function () {
   var tick1, tick2;

   beforeEach(function () {
      tick1 = new GymClockTick(1,2);
      tick2 = new GymClockTick(2,3);
   });


   it("Needs to compare for equality and inequality", function () {

      expect(tick1.equals(tick1)).to.equal(true);
      expect(tick1.equals(tick2)).to.equal(false);
   });

   it("Needs to correctly store attributes", function () {

      expect(tick1.mm).to.equal(1);
      expect(tick1.ss).to.equal(2);
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new TypeRegistry();
      var output = JSON.stringify(tick1);

      var obj = types.reviveFromJSON(output);
      expect(obj.equals(tick1)).to.equal(true);
   });
});

describe("GymClockBeep", function () {
   var beep1, beep2;

   beforeEach(function () {
      beep1 = new GymClockBeep(gymClockBeepType.ThreeBeepStart);
      beep2 = new GymClockBeep(gymClockBeepType.LongBeepStop);
   });


   it("Needs to compare for equality and inequality", function () {

      expect(beep1.equals(beep1)).to.equal(true);
      expect(beep1.equals(beep2)).to.equal(false);
   });

   it("Needs to correctly store attributes", function () {

      expect(beep1.beepType).to.equal(gymClockBeepType.ThreeBeepStart);
      expect(beep1.beepType).not.to.equal(gymClockBeepType.LongBeepStop);
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new TypeRegistry();
      var output = JSON.stringify(beep1);

      var obj = types.reviveFromJSON(output);
      expect(obj.equals(beep1)).to.equal(true);
   });
});
