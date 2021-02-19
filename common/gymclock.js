/*jslint white: false, indent: 3, maxerr: 1000 */
/*global exports*/
/*! Copyright TXPCo, 2020 */
// GymClock spec is a 'templae' for a clock - how log, wether to play music, and which music. 
// GymClock is a running clock - created from a spec, then can start, stop, pause etc. 
// GymClockAction is a way to send the start, pause, stop list via Rpc
// GymClockState is a class to represent the state of a running clock - is is started, stopped, paused etc, and if running, for how long. 

var Enum = require('./enum.js').Enum;

const gymClockDurationEnum = new Enum('Five', 'Ten', 'Fifteen', 'Twenty');
const gymClockMusicEnum = new Enum('Uptempo', 'Midtempo', 'None');
const gymClockStateEnum = new Enum('Stopped', 'CountingDown', 'Running', 'Paused');
const gymClockActionEnum = new Enum('Start', 'Stop', 'Pause');

const countDownSeconds = new Number(16);

// Keep this function need declation in case an extra Enum is added above & this needs to change
function calculateCountToSeconds (durationEnum) {
   switch (durationEnum) {
      case gymClockDurationEnum.Five:
         return (countDownSeconds + 5 * 60);

      default:
      case gymClockDurationEnum.Ten:
         return (countDownSeconds + 10 * 60);

      case gymClockDurationEnum.Fifteen:
         return (countDownSeconds + 15 * 60);

      case gymClockDurationEnum.Twenty:
         return (countDownSeconds + 20 * 60);

   }
};

//==============================//
// GymClockSpec class
//==============================//
var GymClockSpec = (function invocation() {
   "use strict";

  /**
   * Create a GymClockSpec object
   * @param durationEnum - one of the enumeration objects (10, 15, 20, ...)
   * @param musicEnum - one of the enumeration objects (Uptempo, Midtempo, none, ...)
   * @param musicUrl - string URL to the music file. Can be null.
   */
   function GymClockSpec(durationEnum, musicEnum, musicUrl) {

      if (!durationEnum) {
         this.durationEnum = gymClockDurationEnum.Ten;
      } else {
         this.durationEnum = durationEnum;
      }

      if (!musicEnum) {
         this.musicEnum = gymClockMusicEnum.None;
      } else {
         this.musicEnum = musicEnum;
      }
      this.musicUrl = musicUrl;
   }
   
   GymClockSpec.prototype.__type = "GymClockSpec";

  /**
   * test for equality - checks all fields are the same. 
   * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
   * @param rhs - the object to compare this one to.  
   */
   GymClockSpec.prototype.equals = function (rhs) {

      return (this.durationEnum.name === rhs.durationEnum.name
         && this.musicEnum.name === rhs.musicEnum.name
         && this.musicUrl === rhs.musicUrl);
   };

   /**
 * Method that serializes to JSON 
 */
   GymClockSpec.prototype.toJSON = function () {

      return {
         __type: GymClockSpec.prototype.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            durationEnum: this.durationEnum,
            musicEnum: this.musicEnum,
            musicUrl: this.musicUrl
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revive from 
    */
   GymClockSpec.prototype.revive = function (data) {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return GymClockSpec.prototype.reviveDb(data.attributes);

      return GymClockSpec.prototype.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revive from 
   */
   GymClockSpec.prototype.reviveDb = function (data) {

      var spec = new GymClockSpec();

      spec.durationEnum = gymClockDurationEnum.getSymbol (data.durationEnum.name);
      spec.musicEnum = gymClockMusicEnum.getSymbol(data.musicEnum.name);
      spec.musicUrl = data.musicUrl;

      return spec;
   };

   return GymClockSpec;
}());

//==============================//
// GymClock class
//==============================//
var GymClock = (function invocation() {
   "use strict";

   /**
    * Create a GymClock object
    */
   function GymClock(clockSpec) {
      this.clockSpec = clockSpec;
      this.clockStateEnum = gymClockStateEnum.Stopped;
      this.secondsCounted = 0;
      this.startReference = new Date();
      this.countToSeconds = 0;

      if (this.clockSpec.musicUrl) {
         this.audio = new Audio();
         this.audio.src = this.clockSpec.musicUrl;
         this.audio.loop = true;
      } else
         this.audio = null;
   }

   GymClock.prototype.__type = "GymClock";

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   GymClock.prototype.equals = function (rhs) {

      return (this.clockSpec.equals(rhs.clockSpec)
         && this.clockStateEnum.name == rhs.clockStateEnum.name
         && this.secondsCounted === rhs.secondsCounted
         && this.startReference.getTime() === rhs.startReference.getTime()
         && this.countToSeconds === rhs.countToTicks);
   };

   GymClock.prototype.start = function (callbackFn, secondsPlayed) {

      if (secondsPlayed)
         this.secondsCounted = secondsPlayed;
      
      this.countToSeconds = calculateCountToSeconds(this.clockSpec.durationEnum);
      if (this.intervalId) {
         clearInterval(this.intervalId);
         this.intervalId = null;
      }
      this.intervalId = setInterval(this.onClockInterval.bind(this), 200);

      // Set effective start time by working out the duration of any ticks already counted
      this.startReference.setTime(new Date().getTime() - this.secondsCounted * 1000);

      if (this.secondsCounted >= countDownSeconds)
         this.clockStateEnum = gymClockStateEnum.Running;
      else
         this.clockStateEnum = gymClockStateEnum.CountingDown;

      this.callbackFn = callbackFn;

      if (this.audio) {
         this.audio.currentTime = this.secondsCounted;
         this.audio.play();
      }

      // call first tick to start the visible clock
      this.onClockInterval();
   };

   GymClock.prototype.stop = function () {
      if (this.intervalId) {
         clearInterval(this.intervalId);
         this.intervalId = null;
      }
      this.clockStateEnum = gymClockStateEnum.Stopped;
      this.secondsCounted = 0;
      this.countToSeconds = calculateCountToSeconds(this.clockSpec.durationEnum);

      if (this.audio)
         this.audio.pause();

      if (this.callbackFn)
         this.callbackFn(0, 0);
   };

   GymClock.prototype.pause = function () {
      if (this.intervalId) {
         clearInterval(this.intervalId);
         this.intervalId = null;
      }
      if (this.audio)
         this.audio.pause();

      this.clockStateEnum = gymClockStateEnum.Paused;
   };

   GymClock.prototype.onClockInterval = function () {

      var now, mm, ss, seconds;

      now = new Date();
      seconds = (now.getTime() - this.startReference.getTime()) / 1000;
      this.secondsCounted = seconds;

      if (this.clockStateEnum === gymClockStateEnum.CountingDown && seconds < countDownSeconds) {

         mm = Math.floor((countDownSeconds - seconds) / 60);
         ss = Math.floor(countDownSeconds - (mm * 60) - seconds);
      } else {
         if (this.clockStateEnum = gymClockStateEnum.CountingDown) {
            this.clockStateEnum = gymClockStateEnum.Running;
         } 

         mm = Math.floor((seconds - countDownSeconds) / 60);
         ss = Math.ceil(seconds - countDownSeconds - Math.floor(mm * 60)); // Switch from floor to Ceil Compensate for passing zero in common across two counters
         if (seconds >= this.countToSeconds) {
            mm = (this.countToSeconds - countDownSeconds) / 60;
            ss = 0;
            this.stop();
         }
      }
      if (this.callbackFn)
         this.callbackFn(mm, ss);
   };

   GymClock.prototype.isRunning = function () {

      return (this.clockStateEnum.name == gymClockStateEnum.CountingDown.name)
         || (this.clockStateEnum.name == gymClockStateEnum.Running.name);
   };

   GymClock.prototype.canPause = function () {

      return (this.clockStateEnum.name == gymClockStateEnum.CountingDown.name)
         || (this.clockStateEnum.name == gymClockStateEnum.Running.name);
   };

   GymClock.prototype.canStop= function () {

      return (this.clockStateEnum.name == gymClockStateEnum.Paused.name)
         || (this.clockStateEnum.name == gymClockStateEnum.CountingDown.name)
         || (this.clockStateEnum.name == gymClockStateEnum.Running.name);
   };

   GymClock.prototype.canStart = function () {

      return (this.clockStateEnum.name == gymClockStateEnum.Paused.name)
         || (this.clockStateEnum.name == gymClockStateEnum.Stopped.name);
   };

   GymClock.prototype.saveToState = function () {

      return new GymClockState(this.clockStateEnum, this.secondsCounted);
   };

   GymClock.prototype.loadFromState = function (state, callbackFn) {

      switch (state.stateEnum.name) {
         case 'Stopped':
            if (this.canStop())
               this.stop();
            break;
         case 'CountingDown':
         case 'Running':
            if (this.canStart())
               this.start(callbackFn, state.secondsIn);
            break;
         case 'Paused':
            if (this.canPause())
               this.pause();
            break;
      }
   };

   return GymClock;
}());

//==============================//
// GymClockAction class 
//==============================//
var GymClockAction = (function invocation() {
   "use strict";

   /**
    * Create a GymClockAction object
    */
   function GymClockAction(actionEnum) {

      this.actionEnum = actionEnum;
   }

   GymClockAction.prototype.__type = "GymClockAction";

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   GymClockAction.prototype.equals = function (rhs) {

      return (this.actionEnum.name === rhs.actionEnum.name);
   };


   /**
    * Method that serializes to JSON 
    */
   GymClockAction.prototype.toJSON = function () {

      return {
         __type: GymClockAction.prototype.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            actionEnum: this.actionEnum
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revive from 
    */
   GymClockAction.prototype.revive = function (data) {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return GymClockAction.prototype.reviveDb(data.attributes);

      return GymClockAction.prototype.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revive from 
   */
   GymClockAction.prototype.reviveDb = function (data) {

      var action = new GymClockAction();

      action.actionEnum = gymClockActionEnum.getSymbol(data.actionEnum.name);

      return action;
   };

   return GymClockAction;
}());

//==============================//
// GymClockState class 
//==============================//
var GymClockState = (function invocation() {
   "use strict";

   /**
    * Create a GymClockState object
    */
   function GymClockState(stateEnum, secondsIn) {

      this.stateEnum = stateEnum;
      this.secondsIn = secondsIn;
   }

   GymClockState.prototype.__type = "GymClockState";

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   GymClockState.prototype.equals = function (rhs) {

      return (this.stateEnum.name === rhs.stateEnum.name &&
         this.secondsIn === rhs.secondsIn);
   };


   /**
    * Method that serializes to JSON 
    */
   GymClockState.prototype.toJSON = function () {

      return {
         __type: GymClockState.prototype.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            stateEnum: this.stateEnum,
            secondsIn: this.secondsIn
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revive from 
    */
   GymClockState.prototype.revive = function (data) {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return GymClockState.prototype.reviveDb(data.attributes);

      return GymClockState.prototype.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revive from 
   */
   GymClockState.prototype.reviveDb = function (data) {

      var state = new GymClockState();

      state.stateEnum = gymClockStateEnum.getSymbol(data.stateEnum.name);
      state.secondsIn = data.secondsIn;

      return state;
   };

   return GymClockState;
}());

if (typeof exports == 'undefined') {
   // exports = this['types.js'] = {};
} else { 
   exports.gymClockDurationEnum = gymClockDurationEnum;
   exports.gymClockMusicEnum = gymClockMusicEnum;
   exports.gymClockStateEnum = gymClockStateEnum;
   exports.gymClockActionEnum = gymClockActionEnum;
   exports.GymClockSpec = GymClockSpec;
   exports.GymClock = GymClock;
   exports.GymClockAction = GymClockAction;
   exports.GymClockState = GymClockState;
}
