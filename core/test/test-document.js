'use strict';
// Copyright TXPCo ltd, 2020, 2021

var pkg = require('../dist/core-bundle.js');
var EntryPoints = pkg.default;

var StreamableTypes = EntryPoints.StreamableTypes;
var Person = EntryPoints.Person;
var CallParticipation = EntryPoints.CallParticipation;

var LiveWorkout = EntryPoints.LiveWorkout;
var LiveWhiteboardCommand = EntryPoints.LiveWhiteboardCommand;
var LiveDocumentChannelFactoryStub = EntryPoints.LiveDocumentChannelFactoryStub;
var LiveDocumentMaster = EntryPoints.LiveDocumentMaster;
var LiveDocumentRemote = EntryPoints.LiveDocumentRemote;
var LiveWorkoutFactory = EntryPoints.LiveWorkoutFactory;

var expect = require("chai").expect;

describe("LiveWorkout", function () {

   var text1 = "workout1";
   var text2 = "workout2";
   var text3 = "workout3";
   var textIn = "workout4";
   var workoutOut, workoutIn, workout, commandProcessorIn, commandProcessorOut, command1, command2, channelFactory, channelOut, channelIn;

   channelFactory = new LiveDocumentChannelFactoryStub();
   channelOut = channelFactory.createConnectionOut();
   channelIn = channelFactory.createConnectionIn();
   workoutOut = new LiveWorkout(text1, true, channelOut);
   workoutIn = new LiveWorkout(textIn, false, channelIn);
   workout = new LiveWorkout(textIn);
   commandProcessorOut = workoutOut.createCommandProcessor();
   commandProcessorIn = workoutIn.createCommandProcessor();

   beforeEach(function () {
   });


   it("Needs to correctly store attributes", function () {
      expect(workoutOut.whiteboardText).to.equal(text1);
   });

   it("Needs to compare for equality and inequality", function () {

      expect(workoutOut.equals(workoutOut)).to.equal(true);
      expect(workoutOut.equals(workout)).to.equal(false);
   });

   it("Needs to save and restore to/from JSON.", function () {
      var types = new StreamableTypes();
      var output = JSON.stringify(workoutOut);

      var obj = types.reviveFromJSON(output);

      expect(workoutOut.equals(obj)).to.equal(true);
   });

   it("Needs to apply a single command.", function () {

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

   it("Document setup need to work.", function () {

      // Copy them over
      var callParticipation = new CallParticipation("1234567890", "sess1", true);
      var person = new Person(1, "123", "Joe", "Joe@mail.com", "https://jo.pics.com", "1234");

      // create two linked documents
      var master = new LiveDocumentMaster(callParticipation.meetingId,
         person,
         callParticipation,
         new LiveDocumentChannelFactoryStub(),
         new LiveWorkoutFactory());

      var remote = new LiveDocumentRemote(callParticipation.meetingId,
         person,
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
});

