/*jslint white: false, indent: 3, maxerr: 1000 */
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2020 */

var Enum = require('./enum.js').Enum;

const clockType = new Enum('Wall', 'CountUp', 'CountDown', 'Interval');

//==============================//
// WorkoutClockSpec class
//==============================//
var WorkoutClockSpec = (function invocation() {
   "use strict";

  /**
   * Create a WorkoutClockSpec object
   */
   function WorkoutClockSpec() {
      this.clockType = clockType.Wall;
   }
   
   WorkoutClockSpec.prototype.__type = "WorkoutClockSpec";

  /**
   * test for equality - checks all fields are the same. 
   * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
   * @param rhs - the object to compare this one to.  
   */
   WorkoutClockSpec.prototype.equals = function (rhs) {

      return (this.clockType.name === rhs.clockType.name
         && this.countTo === rhs.countTo
         && this.intervals === rhs.intervals
         && this.period1 === rhs.period1
         && this.period2 === rhs.period2); 
   };

   WorkoutClockSpec.prototype.setWall = function () {

      this.clockType = clockType.Wall;
      this.countTo = null;
      this.intervals = null;
      this.period1 = null;
      this.period2 = null;
   };

   WorkoutClockSpec.prototype.setCountUp = function (countTo) {

      this.clockType = clockType.CountUp;
      this.countTo = countTo;
      this.intervals = null;
      this.period1 = null;
      this.period2 = null;
   };

   WorkoutClockSpec.prototype.setCountDown = function (countTo) {

      this.clockType = clockType.CountDown;
      this.countTo = countTo;
      this.intervals = null;
      this.period1 = null;
      this.period2 = null;
   };

   WorkoutClockSpec.prototype.setInterval = function (intervals, period1, period2) {

      this.clockType = clockType.Interval;
      this.intervals = intervals;
      this.period1 = period1;
      this.period2 = period2;
      this.countTo = null;
   };

   /**
 * Method that serializes to JSON 
 */
   WorkoutClockSpec.prototype.toJSON = function () {

      return {
         __type: WorkoutClockSpec.prototype.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            clockType: this.clockType,
            countTo: this.countTo,
            intervals: this.intervals,
            period1: this.period1,
            period2: this.period2
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revive from 
    */
   WorkoutClockSpec.prototype.revive = function (data) {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return WorkoutClockSpec.prototype.reviveDb(data.attributes);

      return WorkoutClockSpec.prototype.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revive from 
   */
   WorkoutClockSpec.prototype.reviveDb = function (data) {

      var spec = new WorkoutClockSpec();

      spec.clockType = data.clockType;
      spec.countTo = data.countTo;
      spec.intervals = data.intervals;
      spec.period1 = data.period1;
      spec.period2 = data.period2;

      return spec;
   };

   return WorkoutClockSpec;
}());

//==============================//
// WorkoutClock class
//==============================//
var WorkoutClock = (function invocation() {
   "use strict";

   /**
    * Create a WorkoutClock object
    */
   function WorkoutClock(clock) {
      this.clock = clock;
      this.mm = '00';
      this.ss = '00';
      this.running = false;
   }

   WorkoutClock.prototype.__type = "ClockTimer";

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   WorkoutClock.prototype.equals = function (rhs) {

      return (this.clock.equals(rhs.clock)
         && this.mm === rhs.hh
         && this.ss === rhs.mm);
   };

   WorkoutClock.prototype.start = function (onTick, onSignalEnd) {
      this.start = new Date();

      this.ticker = setInterval(this.tick, 1000); 
      this.onTick = onTick;
      this.onSignalEnd = onSignalEnd;
      this.tick();
   };

   WorkoutClock.prototype.stop = function () {
      if (this.ticker) {
         clearInterval(this.ticker);
         this.ticker = null;
      }
   };

   WorkoutClock.prototype.startTime = function () {
      return this.start;
   };

   WorkoutClock.prototype.tick = function () {
      var now, mm, ss, seconds;

      switch (this.clock.__type) {
         default:
         case clockType.Wall:
            now = new Date();
            mm = now.getMinutes();
            ss = now.getSeconds();
            this.mm = ("00" + mm).slice(-2);
            this.ss = ("00" + ss).slice(-2);
            if (this.onTick)
               this.onTick();
            break;

         case clockType.CountUp:
            now = new Date();
            seconds = (now.getTime() - this.start.getTime()) / 1000;
            mm = Math.floor(seconds / 60);
            ss = seconds - Math.floor(mm * 60);
            this.mm = ("00" + mm).slice(-2);
            this.ss = ("00" + ss).slice(-2);
            if (this.onTick)
               this.onTick();
            break;

         case clockType.CountDown:
            now = new Date();
            seconds = (now.getTime() - this.start.getTime()) / 1000;
            mm = this.clock.countTo - (Math.floor(seconds / 60)) - 1;
            ss = Math.floor ((this.clock.countTo * 60) - (mm * 60));
            this.mm = ("00" + mm).slice(-2);
            this.ss = ("00" + ss).slice(-2);
            if (this.onTick)
               this.onTick();
            break;

         case clockType.Interval:
            // An interval clock is very similar to a countUp, but repeatedly rounded down by the interval split times.
            now = new Date();
            seconds = (now.getTime() - this.start.getTime()) / 1000;
            mm = Math.floor(seconds / 60);
            ss = seconds - Math.floor(mm * 60);

            for (var i = 0; i < this.clock.intervals; i++) {
               if (mm > this.clock.period1)
                  mm -= this.clock.period1;
               if (mm > this.clock.period2)
                  mm -= this.clock.period2;
            }
            this.mm = ("00" + mm).slice(-2);
            this.ss = ("00" + ss).slice(-2);
            if (this.onTick)
               this.onTick();
            break;
      }

   };

   return WorkoutClock;
}());

if (typeof exports == 'undefined') {
   // exports = this['types.js'] = {};
} else { 
   exports.WorkoutClockSpec = WorkoutClockSpec;
   exports.WorkoutClock = WorkoutClock;
}
