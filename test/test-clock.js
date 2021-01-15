'use strict';
// Copyright TXPCo ltd, 2020

if (typeof exports !== 'undefined') {

   var clockModule = require('../common/clock.js');
   var Clock = clockModule.Clock;
   var ClockTimer = clockModule.ClockTimer;
   var expect = require("chai").expect;
}


describe("Clock", function () {
   var clock1, clock2, clock3;
   
   beforeEach(function () {
      clock1 = new Clock(); 
      clock1.setCountUp(20);

      clock2 = new Clock();
      clock2.setCountDown(20);

      clock3 = new Clock();
      clock3.setInterval(4, 3, 1);
   });
   
   it("Needs to compare for equality and inequality", function () {
      
      expect(clock1.equals(clock1)).to.equal(true);
      expect(clock1.equals(clock2)).to.equal(false);
   });
   
   it("Needs to correctly store attributes", function () {
        
      expect(clock1.countTo).to.equal(20);      
      expect(clock3.intervals).to.equal(4); 
      expect(clock3.period1).to.equal(3); 
      expect(clock3.period2).to.equal(1); 
   });
});

describe("ClockTimer", function () {
   var clock1, clock2, clock3, clock4;
   var timer1, timer2, timer3, timer4;

   beforeEach(function () {
      clock1 = new Clock();
      clock1.setCountUp(20);
      timer1 = new ClockTimer(clock1);

      clock2 = new Clock();
      clock2.setCountUp(20);
      timer2 = new ClockTimer(clock2);

      clock3 = new Clock();
      clock3.setCountDown(20);
      timer3 = new ClockTimer(clock3);

      clock4 = new Clock();
      clock4.setInterval(4, 3, 1);
      timer4 = new ClockTimer(clock4);
   });

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
      expect(true).to.equal(false);
   });

   it("Needs to tick as interval clock", function () {
      expect(true).to.equal(false);
   });
});