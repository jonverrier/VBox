'use strict';
// Copyright TXPCo ltd, 2020

if (typeof exports !== 'undefined') {

   var clockModule = require('../common/gymclock.js');
   var gymClockDurationEnum = clockModule.gymClockDurationEnum;
   var gymClockMusicEnum = clockModule.gymClockMusicEnum;
   var gymClockActionEnum = clockModule.gymClockActionEnum;
   var GymClockSpec = clockModule.GymClockSpec;
   var GymClock = clockModule.GymClock;
   var GymClockAction = clockModule.GymClockAction;
   var GymClockBeep = clockModule.GymClockBeep;
   var typesModule = require('../common/types.js');
   var TypeRegistry = typesModule.TypeRegistry;

   var expect = require("chai").expect;
}

describe("GymClockSpec", function () {
   var spec1, spec2;
   var now = new Date();
   
   beforeEach(function () {
      spec1 = new GymClockSpec(gymClockDurationEnum.Ten, gymClockMusicEnum.None, null); 
      spec2 = new GymClockSpec(gymClockDurationEnum.Fifteen, gymClockMusicEnum.None, null);
   });

   it("Needs to compare for equality and inequality", function () {
      
      expect(spec1.equals(spec1)).to.equal(true);
      expect(spec1.equals(spec2)).to.equal(false);
   });
   
   it("Needs to correctly store attributes", function () {
        
      expect(spec1.durationEnum).to.equal(gymClockDurationEnum.Ten);      
      expect(spec1.musicEnum).to.equal(gymClockMusicEnum.None); 
      expect(spec1.musicUrl).to.equal(null); 
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
      spec1 = new GymClockSpec(gymClockDurationEnum.Ten, gymClockMusicEnum.None, null);
      timer1 = new GymClock(spec1);

      spec2 = new GymClockSpec(gymClockDurationEnum.Fifteen, gymClockMusicEnum.None, null);
      timer2 = new GymClock(spec2);
   });

   it("Needs to tick as count up clock", function () {
      timer1.start(null, null);
      var now = new Date();

      setTimeout(function () {
         var seconds = timer1.ss;
         expect(seconds === '03' || seconds === '04').to.equal(true);
      }, 3000);
   });

   it("Needs to correctly store attributes", function () {

      expect(timer1.clockSpec).to.equal(spec1);
   });

});

describe("GymClockAction", function () {
   var action1, action2;

   beforeEach(function () {
      action1 = new GymClockAction(gymClockActionEnum.Start);
      action2 = new GymClockAction(gymClockActionEnum.Stop);
   });


   it("Needs to compare for equality and inequality", function () {

      expect(action1.equals(action1)).to.equal(true);
      expect(action1.equals(action2)).to.equal(false);
   });

   it("Needs to correctly store attributes", function () {

      expect(action1.actionEnum).to.equal(gymClockActionEnum.Start);
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new TypeRegistry();
      var output = JSON.stringify(action1);

      var obj = types.reviveFromJSON(output);
      expect(obj.equals(action1)).to.equal(true);
   });
});

