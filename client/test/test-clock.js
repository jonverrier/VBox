// Copyright TXPCo Ltd, 2020, 2021
'use strict';

global.document = undefined;

var pkg1 = require('../../core/dist/core-bundle.js');
var coreEntryPoints = pkg1.default;
var GymClockDurationEnum = coreEntryPoints.GymClockDurationEnum;
var GymClockMusicEnum = coreEntryPoints.GymClockMusicEnum;
var GymClockActionEnum = coreEntryPoints.GymClockActionEnum;
var GymClockStateEnum = coreEntryPoints.GymClockStateEnum;
var GymClockSpec = coreEntryPoints.GymClockSpec;
var GymClockAction = coreEntryPoints.GymClockAction;
var GymClockState = coreEntryPoints.GymClockState;
var TypeRegistry = coreEntryPoints.TypeRegistry;

var pkg2 = require('../dist/client-bundle.js');
var clientEntryPoints = pkg2.default;

console.log(JSON.stringify(clientEntryPoints));

var RunnableClock = clientEntryPoints.RunnableClock;

var expect = require("chai").expect;

describe("RunnableClock", function () {
   var clock1, clock2, spec1, spec2;
   var now = new Date();

   beforeEach(function () {
      spec1 = new GymClockSpec(GymClockDurationEnum.Ten, GymClockMusicEnum.None, null);
      spec2 = new GymClockSpec(GymClockDurationEnum.Fifteen, GymClockMusicEnum.None, null);
      clock1 = new RunnableClock (spec1);
      clock2 = new RunnableClock (spec2);
   });

   it("Needs to compare for equality and inequality", function () {

      expect(clock1.equals(clock1)).to.equal(true);
      expect(clock1.equals(clock2)).to.equal(false);
   });

   it("Needs to correctly store attributes", function () {

      expect(clock1.clockSpec).to.equal(spec1);
   });
   it("Needs to start-pause-stop", function () {

      expect(clock1.clockState).to.equal(GymClockState.Stopped);
      expect(clock1.isRunning()).to.equal(false);

      clock1.start(function () {
      });

      expect(clock1.isRunning()).to.equal(true);

      clock1.pause();
      expect(clock1.isRunning()).to.equal(false);
      expect(clock1.clockStateEnum).to.equal(GymClockStateEnum.Paused);

      clock1.stop();
      expect(clock1.isRunning()).to.equal(false);
      expect(clock1.clockStateEnum).to.equal(GymClockStateEnum.Stopped);
   });

});