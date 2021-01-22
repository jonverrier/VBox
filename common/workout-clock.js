/*jslint white: false, indent: 3, maxerr: 1000 */
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2020 */

var Enum = require('./enum.js').Enum;

const workoutClockType = new Enum('Wall', 'CountUp', 'CountDown', 'Interval');

//==============================//
// WorkoutClockSpec class
//==============================//
var WorkoutClockSpec = (function invocation() {
   "use strict";

  /**
   * Create a WorkoutClockSpec object
   */
   function WorkoutClockSpec() {
      this.clockType = workoutClockType.Wall;
   }
   
   WorkoutClockSpec.prototype.__type = "WorkoutClockSpec";

  /**
   * test for equality - checks all fields are the same. 
   * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
   * @param rhs - the object to compare this one to.  
   */
   WorkoutClockSpec.prototype.equals = function (rhs) {

      return (this.clockType.name === rhs.clockType.name
         && this.startAt === rhs.startAt
         && this.countTo === rhs.countTo
         && this.intervals === rhs.intervals
         && this.period1 === rhs.period1
         && this.period2 === rhs.period2); 
   };

   WorkoutClockSpec.prototype.isValidWallSpec = function (startAt) {

      var seconds = (new Date().getTime() - startAt.getTime()) / 1000;

      return (seconds < 60000 && seconds > -60000); // Say its valid if current time plus or minus an hour
   };

   WorkoutClockSpec.prototype.isValidCountUpSpec = function (countTo) {

      return (countTo <= 60 && countTo > 0); // Say its valid if positive & up to 60 mins
   };

   WorkoutClockSpec.prototype.isValidCountDownSpec = function (countTo) {

      return (countTo <= 60 && countTo > 0); // Say its valid if positive & up to 60 mins
   };

   WorkoutClockSpec.prototype.isValidIntervalSpec = function (intervals, period1, period2) {

      // Say its valid if intervals is positive, period1 is positive
      return (intervals > 0 && intervals <= 60 && period1 > 0 && period1 <= 60 && period2 >= 0 && period2 <= 60); 
   };

   WorkoutClockSpec.prototype.setWall = function (startAt) {

      this.clockType = workoutClockType.Wall;
      this.startAt = startAt;
      this.countTo = null;
      this.intervals = null;
      this.period1 = null;
      this.period2 = null;
   };

   WorkoutClockSpec.prototype.setCountUp = function (countTo) {

      this.clockType = workoutClockType.CountUp;
      this.countTo = countTo;
      this.startAt = null;
      this.intervals = null;
      this.period1 = null;
      this.period2 = null;
   };

   WorkoutClockSpec.prototype.setCountDown = function (countTo) {

      this.clockType = workoutClockType.CountDown;
      this.countTo = countTo;
      this.startAt = null;
      this.intervals = null;
      this.period1 = null;
      this.period2 = null;
   };

   WorkoutClockSpec.prototype.setInterval = function (intervals, period1, period2) {

      this.clockType = workoutClockType.Interval;
      this.intervals = intervals;
      this.period1 = period1;
      this.period2 = period2;
      this.startAt = null;
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
            startAt: this.startAt,
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
      spec.startAt = data.startAt;
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
      this.mm = 0;
      this.ss = 0;
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
      this.startedAt = new Date();
      this.ticker = setInterval(this.tick.bind(this), 1000); 
      this.onTick = onTick;
      this.onSignalEnd = onSignalEnd;
      this.running = true;

      // call first tick to start the clock
      this.tick();
   };

   WorkoutClock.prototype.stop = function () {
      if (this.ticker) {
         clearInterval(this.ticker);
         this.ticker = null;
      }
      this.running = false;
   };

   WorkoutClock.prototype.startTime = function () {
      return this.startedAt;
   };

   WorkoutClock.prototype.tick = function () {
      var now, mm, ss, seconds;

      switch (this.clock.__type) {
         default:
         case workoutClockType.Wall:
            now = new Date();
            mm = Math.floor(now.getMinutes());
            ss = Math.floor(now.getSeconds());
            break;

         case workoutClockType.CountUp:
            now = new Date();
            seconds = (now.getTime() - this.startedAt.getTime()) / 1000;
            mm = Math.floor(seconds / 60);
            ss = Math.floor(seconds - Math.floor(mm * 60));
            break;

         case workoutClockType.CountDown:
            now = new Date();
            seconds = (now.getTime() - this.startedAt.getTime()) / 1000;
            mm = Math.floor(this.clock.countTo - (Math.floor(seconds / 60)) - 1);
            ss = Math.floor ((this.clock.countTo * 60) - (mm * 60));
            break;

         case workoutClockType.Interval:
            // An interval clock is very similar to a countUp, but repeatedly rounded down by the interval split times.
            now = new Date();
            seconds = (now.getTime() - this.startedAt.getTime()) / 1000;
            mm = Math.floor(seconds / 60);
            ss = Math.floor(seconds - Math.floor(mm * 60));

            for (var i = 0; i < this.clock.intervals; i++) {
               if (mm > this.clock.period1)
                  mm -= this.clock.period1;
               if (mm > this.clock.period2)
                  mm -= this.clock.period2;
            }
            break;
      }

      this.mm = mm;
      this.ss = ss;
      if (this.onTick)
         this.onTick(this.mm, this.ss);
   };

   return WorkoutClock;
}());

if (typeof exports == 'undefined') {
   // exports = this['types.js'] = {};
} else { 
   exports.workoutClockType = workoutClockType;
   exports.WorkoutClockSpec = WorkoutClockSpec;
   exports.WorkoutClock = WorkoutClock;
}
