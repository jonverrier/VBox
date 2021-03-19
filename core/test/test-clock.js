'use strict';
// Copyright TXPCo ltd, 2020, 2021

var pkg = require('../dist/core-bundle.js');
var EntryPoints = pkg.default;

var EGymClockDuration = EntryPoints.EGymClockDuration;
var EGymClockMusic = EntryPoints.EGymClockMusic;
var EGymClockState = EntryPoints.EGymClockState;
var GymClockSpec = EntryPoints.GymClockSpec;
var GymClockState = EntryPoints.GymClockState;
var StreamableTypes = EntryPoints.StreamableTypes;

var expect = require("chai").expect;

describe("GymClockSpec", function () {
   var spec1, spec2;
   var now = new Date();
   
   beforeEach(function () {
      spec1 = new GymClockSpec(EGymClockDuration.Ten, EGymClockMusic.None, null); 
      spec2 = new GymClockSpec(EGymClockDuration.Fifteen, EGymClockMusic.None, null);
   });

   it("Needs to compare for equality and inequality", function () {
      
      expect(spec1.equals(spec1)).to.equal(true);
      expect(spec1.equals(spec2)).to.equal(false);
   });
   
   it("Needs to correctly store attributes", function () {
        
      expect(spec1.durationEnum).to.equal(EGymClockDuration.Ten);      
      expect(spec1.musicEnum).to.equal(EGymClockMusic.None); 
      expect(spec1.musicUrl).to.equal(null); 
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new StreamableTypes();
      var output = JSON.stringify(spec1);

      var obj = types.reviveFromJSON(output);
      expect(obj.equals(spec1)).to.equal(true);
   });
});

describe("GymClockState", function () {
   var state1, state2;

   beforeEach(function () {
      state1 = new GymClockState(EGymClockState.Running, 0);
      state2 = new GymClockState(EGymClockState.Stopped, 1);
   });


   it("Needs to compare for equality and inequality", function () {

      expect(state1.equals(state1)).to.equal(true);
      expect(state1.equals(state2)).to.equal(false);
   });

   it("Needs to correctly store attributes", function () {

      expect(state1.stateEnum).to.equal(EGymClockState.Running);
      expect(state1.secondsCounted).to.equal(0);
   });

   it("Needs to save and restore to/from JSON", function () {

      var types = new StreamableTypes();
      var output = JSON.stringify(state1);

      var obj = types.reviveFromJSON(output);
      expect(obj.equals(state1)).to.equal(true);
   });
});