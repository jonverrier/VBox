'use strict';
// Copyright TXPCo ltd, 2020, 2021

var pkg = require('../dist/core-bundle.js');
var EntryPoints = pkg.default;

var StreamableTypes = EntryPoints.StreamableTypes;
var Person = EntryPoints.Person;
var PersonAttendance = EntryPoints.PersonAttendance;
var CallParticipation = EntryPoints.CallParticipation;

var LiveWorkout = EntryPoints.LiveWorkout;
var LiveWhiteboardCommand = EntryPoints.LiveWhiteboardCommand;
var LiveClockSpecCommand = EntryPoints.LiveClockSpecCommand;
var LiveClockStateCommand = EntryPoints.LiveClockStateCommand;
var LiveAttendanceCommand = EntryPoints.LiveAttendanceCommand;
var LiveViewStateCommand = EntryPoints.LiveViewStateCommand;
var LiveDocumentChannelFactoryStub = EntryPoints.LiveDocumentChannelFactoryStub;
var LiveDocumentMaster = EntryPoints.LiveDocumentMaster;
var LiveDocumentRemote = EntryPoints.LiveDocumentRemote;
var LiveWorkoutFactory = EntryPoints.LiveWorkoutFactory;
var EViewState = EntryPoints.EViewState;

var EGymClockDuration = EntryPoints.EGymClockDuration;
var EGymClockMusic = EntryPoints.EGymClockMusic;
var EGymClockState = EntryPoints.EGymClockState;
var GymClockSpec = EntryPoints.GymClockSpec;
var GymClockState = EntryPoints.GymClockState;

var expect = require("chai").expect;

describe("LiveWorkout", function () {

   var text1 = "workout1";
   var text2 = "workout2";
   var text3 = "workout3";
   var textIn = "workout4";
   var workoutOut, workoutIn, workout, commandProcessorIn, commandProcessorOut,
       command1, command2, channelFactory, channelOut, channelIn, callParticipation;
   let clockSpec = new GymClockSpec(EGymClockDuration.Ten, EGymClockMusic.None);
   let clockState = new GymClockState(EGymClockState.Stopped, 0);

   channelFactory = new LiveDocumentChannelFactoryStub();

   beforeEach(function () {
      channelOut = channelFactory.createConnectionOut();
      channelIn = channelFactory.createConnectionIn();
      workoutOut = new LiveWorkout(text1, '', clockSpec, clockState, new Array(), EViewState.Whiteboard, true, channelOut);
      workoutIn  = new LiveWorkout(textIn, '', clockSpec, clockState, new Array(), EViewState.Whiteboard, false, channelIn);
      commandProcessorOut = workoutOut.createCommandProcessor();
      commandProcessorIn = workoutIn.createCommandProcessor();
      callParticipation = new CallParticipation("1234567890", "sess1", true);
   });

   it("Needs to correctly store attributes", function () {
      expect(workoutOut.whiteboardText).to.equal(text1);
   });

   it("Needs to compare for equality and inequality", function () {

      expect(workoutOut.equals(workoutOut)).to.equal(true);
      expect(workoutOut.equals(workoutIn)).to.equal(false);
   });

   it("Needs to save and restore to/from JSON.", function () {
      var types = new StreamableTypes();
      var output = JSON.stringify(workoutOut);
      var obj = types.reviveFromJSON(output);

      expect(workoutOut.equals(obj)).to.equal(true);
   });

   it("Needs to apply a single command.", function () {

      // Make the documents match at the start
      channelOut.sendDocumentTo(callParticipation, workoutOut);

      command1 = new LiveWhiteboardCommand(text2, workoutOut.whiteboardText);

      // Apply the command, then check it has worked, can be undone, cannot be undone
      commandProcessorOut.adoptAndApply(command1);
      expect(workoutOut.whiteboardText === text2).to.equal(true);
      expect(commandProcessorOut.canUndo()).to.equal(true);
      expect(commandProcessorOut.canRedo()).to.equal(false);

      // Undo it, check the result, check it can be re-done and not undone
      commandProcessorOut.undo();
      expect(workoutOut.whiteboardText === text1).to.equal(true);
      expect(commandProcessorOut.canRedo()).to.equal(true);
      expect(commandProcessorOut.canUndo()).to.equal(false);

      // Clear commands for next test
      commandProcessorOut.clearCommands();
   });

   it("Needs to apply multiple commands.", function () {

      // Make the documents match at the start
      channelOut.sendDocumentTo(callParticipation, workoutOut);

      command1 = new LiveWhiteboardCommand(text2, workoutOut.whiteboardText);

      // Apply the command, then check it has worked, can be undone, cannot be undone
      commandProcessorOut.adoptAndApply(command1);
      expect(workoutOut.whiteboardText === text2).to.equal(true);
      expect(commandProcessorOut.canUndo()).to.equal(true);
      expect(commandProcessorOut.canRedo()).to.equal(false);

      // Apply another command, then check it has worked, can be undone, cannot be undone
      command2 = new LiveWhiteboardCommand(text3, workoutOut.whiteboardText);
      commandProcessorOut.adoptAndApply(command2);
      expect(workoutOut.whiteboardText === text3).to.equal(true);
      expect(commandProcessorOut.canUndo()).to.equal(true);
      expect(commandProcessorOut.canRedo()).to.equal(false);

      // Undo it, check the result, check it can be re-done and can still undo the previous one
      commandProcessorOut.undo();
      expect(workoutOut.whiteboardText === text2).to.equal(true);
      expect(commandProcessorOut.canRedo()).to.equal(true);
      expect(commandProcessorOut.canUndo()).to.equal(true);

      // Undo and clear commands for next test
      commandProcessorOut.undo();
      commandProcessorOut.clearCommands();
   });

   it("Needs to synch whole document to remote.", function () {

      // Initially they are different
      expect(workoutOut.equals(workoutIn)).to.equal(false);

      // Copy them over
      var callParticipation = new CallParticipation("1234567890", "sess1", true);
      channelOut.sendDocumentTo(callParticipation, workoutOut);
      expect(workoutOut.equals(workoutIn)).to.equal(true);

   });

   it("Needs to synch commands to remote.", function () {

      // Copy them over
      var callParticipation = new CallParticipation("1234567890", "sess1", true);
      channelOut.sendDocumentTo(callParticipation, workoutOut);
      expect(workoutOut.equals(workoutIn)).to.equal(true);

      command1 = new LiveWhiteboardCommand(text2, workoutOut.whiteboardText);

      // Apply the command, then check it has worked, can be undone, cannot be undone
      commandProcessorOut.adoptAndApply(command1);
      expect(workoutOut.whiteboardText === text2).to.equal(true);
      expect(commandProcessorOut.canUndo()).to.equal(true);
      expect(commandProcessorOut.canRedo()).to.equal(false);
      expect(workoutOut.equals(workoutIn)).to.equal(true);

      // Apply another command, then check it has worked, can be undone, cannot be undone
      command2 = new LiveWhiteboardCommand(text3, workoutOut.whiteboardText);
      commandProcessorOut.adoptAndApply(command2);
      expect(workoutOut.whiteboardText === text3).to.equal(true);
      expect(commandProcessorOut.canUndo()).to.equal(true);
      expect(commandProcessorOut.canRedo()).to.equal(false);
      expect(workoutOut.equals(workoutIn)).to.equal(true);

      // Undo it, check the result, check it can be re-done and can still undo the previous one
      commandProcessorOut.undo();
      expect(workoutOut.whiteboardText === text2).to.equal(true);
      expect(commandProcessorOut.canRedo()).to.equal(true);
      expect(commandProcessorOut.canUndo()).to.equal(true);
      expect(workoutOut.equals(workoutIn)).to.equal(true);

      // Undo and clear commands for next test
      commandProcessorOut.undo();
      expect(workoutOut.equals(workoutIn)).to.equal(true);

      commandProcessorOut.clearCommands();
      commandProcessorIn.clearCommands();

   }); 

   it("Needs to apply a single command then undo it to remote document.", function () {

      // Copy them over
      var callParticipation = new CallParticipation("1234567890", "sess1", true);
      channelOut.sendDocumentTo(callParticipation, workoutOut);
      expect(workoutOut.equals(workoutIn)).to.equal(true);

      command1 = new LiveWhiteboardCommand(text2, workoutOut.whiteboardText);

      // Apply the command, then check it has worked, can be undone, cannot be undone
      commandProcessorOut.adoptAndApply(command1);
      expect(workoutOut.whiteboardText === text2).to.equal(true);
      expect(workoutIn.whiteboardText === text2).to.equal(true);
      expect(commandProcessorOut.canUndo()).to.equal(true);
      expect(commandProcessorOut.canRedo()).to.equal(false);
      expect(workoutOut.equals(workoutIn)).to.equal(true);

      // Undo it, check the result, check it can be re-done and not undone
      commandProcessorOut.undo();
      expect(workoutOut.whiteboardText === text1).to.equal(true);
      expect(commandProcessorOut.canRedo()).to.equal(true);
      expect(commandProcessorOut.canUndo()).to.equal(false);
      expect(workoutOut.equals(workoutIn)).to.equal(true);

      // Clear commands for next test
      commandProcessorOut.clearCommands();
   });

   it("Can setup a LiveDocument flows.", function () {

      // Copy them over
      var callParticipation = new CallParticipation("1234567890", "sess1", true);
      var person = new Person(1, "123", "Joe", "Joe@mail.com", "https://jo.pics.com", "1234");

      // create two linked documents
      var master = new LiveDocumentMaster(person,
         callParticipation,
         new LiveDocumentChannelFactoryStub(),
         new LiveWorkoutFactory());

      var remote = new LiveDocumentRemote(person,
         callParticipation,
         new LiveDocumentChannelFactoryStub(),
         new LiveWorkoutFactory());
      remote.document.whiteboardText = "Not the same."

      expect(remote.document.equals(master.document)).to.equal(false);
      master.channel.sendDocumentTo(callParticipation, master.document);
      expect(remote.document.equals(master.document)).to.equal(true);

      command1 = new LiveWhiteboardCommand(text2, master.document.whiteboardText);

      // Apply the command, then check it has worked, can be undone, cannot be undone
      master.commandProcessor.adoptAndApply(command1);
      expect(master.document.whiteboardText === text2).to.equal(true);
      expect(remote.document.equals(master.document)).to.equal(true);
   });

   it("Can apply and reverse clock spec changes.", function () {

      let clockSpec = new GymClockSpec(EGymClockDuration.Ten, EGymClockMusic.None);
      let oldClock = workoutOut.clockSpec;
      command1 = new LiveClockSpecCommand(clockSpec, oldClock);

      // Apply the command, then check it has worked, can be undone, cannot be undone
      commandProcessorOut.adoptAndApply(command1);
      expect(workoutOut.clockSpec.equals(clockSpec)).to.equal(true);
      expect(commandProcessorOut.canUndo()).to.equal(true);
      expect(commandProcessorOut.canRedo()).to.equal(false);

      // Undo it, check the result, check it can be re-done and not undone
      commandProcessorOut.undo();
      expect(workoutOut.clockSpec.equals(oldClock)).to.equal(true);
      expect(commandProcessorOut.canRedo()).to.equal(true);
      expect(commandProcessorOut.canUndo()).to.equal(false);

      // Clear commands for next test
      commandProcessorOut.clearCommands();
   });

   it("Can apply and reverse clock state changes.", function () {

      let clockState = new GymClockState(EGymClockState.Stopped, 0);
      let oldClock = workoutOut.clockState;
      command1 = new LiveClockStateCommand(clockState, oldClock);

      // Apply the command, then check it has worked, can be undone, cannot be undone
      commandProcessorOut.adoptAndApply(command1);
      expect(workoutOut.clockState.equals(clockState)).to.equal(true);
      expect(commandProcessorOut.canUndo()).to.equal(true);
      expect(commandProcessorOut.canRedo()).to.equal(false);

      // Undo it, check the result, check it can be re-done and not undone
      commandProcessorOut.undo();
      expect(workoutOut.clockState.equals(oldClock)).to.equal(true);
      expect(commandProcessorOut.canRedo()).to.equal(true);
      expect(commandProcessorOut.canUndo()).to.equal(false);

      // Clear commands for next test
      commandProcessorOut.clearCommands();
   });

   it("Can apply and reverse Attendance changes.", function () {

      var person = new Person(1, "123", "Joe", "Joe@mail.com", "https://jo.pics.com", "1234");

      let attendance = new PersonAttendance (0, person, new Date());
      command1 = new LiveAttendanceCommand(attendance, attendance);

      // Apply the command, then check it has worked, can be undone, cannot be undone
      commandProcessorOut.adoptAndApply(command1);
      expect(workoutOut.attendances.indexOf(attendance) !== -1).to.equal(true);
      expect(commandProcessorOut.canUndo()).to.equal(true);
      expect(commandProcessorOut.canRedo()).to.equal(false);

      // Undo it, check the result, check it can be re-done and not undone
      commandProcessorOut.undo();
      expect(workoutOut.attendances.indexOf(attendance) === -1).to.equal(true);
      expect(commandProcessorOut.canRedo()).to.equal(true);
      expect(commandProcessorOut.canUndo()).to.equal(false);

      // Clear commands for next test
      commandProcessorOut.clearCommands();
   });

   it("Can apply and reverse view state changes.", function () {

      let viewState = EViewState.CoachVideo;
      let oldView = workoutOut.viewState;
      command1 = new LiveViewStateCommand(viewState, oldView);

      // Apply the command, then check it has worked, can be undone, cannot be undone
      commandProcessorOut.adoptAndApply(command1);
      expect(workoutOut.viewState === viewState).to.equal(true);
      expect(commandProcessorOut.canUndo()).to.equal(true);
      expect(commandProcessorOut.canRedo()).to.equal(false);

      // Undo it, check the result, check it can be re-done and not undone
      commandProcessorOut.undo();
      expect(workoutOut.viewState === oldView).to.equal(true);
      expect(commandProcessorOut.canRedo()).to.equal(true);
      expect(commandProcessorOut.canUndo()).to.equal(false);

      // Clear commands for next test
      commandProcessorOut.clearCommands();
   });
});

