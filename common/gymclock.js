/*jslint white: false, indent: 3, maxerr: 1000 */
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2020 */

var Enum = require('./enum.js').Enum;

const gymClockDurationEnum = new Enum('Ten', 'Fifteen', 'Twenty');
const gymClockMusicEnum = new Enum('Uptempo', 'Midtempo', 'None');
const gymClockStateEnum = new Enum('Stopped', 'CountingDown', 'Running', 'Paused');
const gymClockActionEnum = new Enum('Start', 'Stop', 'Pause');

const countDownSeconds = new Number(15);

// Keep this function need declation in case an extra Enum is added above & this needs to change
function calculateCountToSeconds (durationEnum) {
   switch (durationEnum) {
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

      spec.durationEnum = data.durationEnum;
      spec.musicEnum = data.musicEnum;
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

   GymClock.prototype.start = function (onTick, secondsPlayed) {

      if (!secondsPlayed)
         secondsPlayed = new Number(0);

      if (this.clockStateEnum === gymClockStateEnum.Stopped) {
         this.startReference = new Date();
         this.tickerFn = setInterval(this.onClockInterval.bind(this), 200);
         this.clockStateEnum = gymClockStateEnum.CountingDown;
         this.secondsCounted = secondsPlayed;
         this.countToSeconds = calculateCountToSeconds(this.clockSpec.durationEnum);
      } else 
      if (this.clockStateEnum === gymClockStateEnum.Paused) {
         // Set a new effective start time by working out the duration of ticks already counted
         this.startReference.setTime(new Date().getTime() - this.secondsCounted * 1000);
         this.tickerFn = setInterval(this.onClockInterval.bind(this), 200);
         if (this.secondsCounted >= countDownSeconds)
            this.clockStateEnum = gymClockStateEnum.Running;
         else
            this.clockStateEnum = gymClockStateEnum.CountingDown;
      }

      this.onTick = onTick;

      if (this.audio)
         this.audio.play();

      // call first tick to start the visible clock
      this.onClockInterval();
   };

   GymClock.prototype.stop = function () {
      if (this.tickerFn) {
         clearInterval(this.tickerFn);
         this.tickerFn = null;
      }
      this.clockStateEnum = gymClockStateEnum.Stopped;
      this.secondsCounted = 0;
      this.countToSeconds = calculateCountToSeconds(this.clockSpec.durationEnum);

      if (this.audio)
         this.audio.stop();

      if (this.onTick)
         this.onTick(0, 0);
   };

   GymClock.prototype.pause = function () {
      if (this.tickerFn) {
         clearInterval(this.tickerFn);
         this.tickerFn = null;
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
      if (this.onTick)
         this.onTick(mm, ss);
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

      var actions = new GymClockAction();

      actions.actionEnum = data.actionEnum;

      return actions;
   };

   return GymClockAction;
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
}
