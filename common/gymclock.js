/*jslint white: false, indent: 3, maxerr: 1000 */
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2020 */

var Enum = require('./enum.js').Enum;

const gymClockType = new Enum('Wall', 'CountUp', 'CountDown', 'Interval');
const gymClockBeepType = new Enum('ThreeBeepStart', 'LongBeepStop');

//==============================//
// GymClockSpec class
//==============================//
var GymClockSpec = (function invocation() {
   "use strict";

  /**
   * Create a GymClockSpec object
   */
   function GymClockSpec() {
      this.clockType = gymClockType.Wall;
   }
   
   GymClockSpec.prototype.__type = "GymClockSpec";

  /**
   * test for equality - checks all fields are the same. 
   * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
   * @param rhs - the object to compare this one to.  
   */
   GymClockSpec.prototype.equals = function (rhs) {

      return (this.clockType.name === rhs.clockType.name
         && this.startAt === rhs.startAt
         && this.countTo === rhs.countTo
         && this.intervals === rhs.intervals
         && this.period1 === rhs.period1
         && this.period2 === rhs.period2); 
   };

   GymClockSpec.prototype.isValidWallSpec = function (startAt) {

      var seconds = (new Date().getTime() - startAt.getTime()) / 1000;

      return (seconds < 60000 && seconds > -60000); // Say its valid if current time plus or minus an hour
   };

   GymClockSpec.prototype.isValidCountUpSpec = function (countTo) {

      return (countTo <= 60 && countTo > 0); // Say its valid if positive & up to 60 mins
   };

   GymClockSpec.prototype.isValidCountDownSpec = function (countTo) {

      return (countTo <= 60 && countTo > 0); // Say its valid if positive & up to 60 mins
   };

   GymClockSpec.prototype.isValidIntervalSpec = function (intervals, period1, period2) {

      // Say its valid if intervals is positive, period1 is positive
      return (intervals > 0 && intervals <= 60 && period1 > 0 && period1 <= 60 && period2 >= 0 && period2 <= 60); 
   };

   GymClockSpec.prototype.setWall = function (startAt) {

      this.clockType = gymClockType.Wall;
      this.startAt = startAt;
      this.countTo = null;
      this.intervals = null;
      this.period1 = null;
      this.period2 = null;
   };

   GymClockSpec.prototype.setCountUp = function (countTo) {

      this.clockType = gymClockType.CountUp;
      this.countTo = countTo;
      this.startAt = null;
      this.intervals = null;
      this.period1 = null;
      this.period2 = null;
   };

   GymClockSpec.prototype.setCountDown = function (countTo) {

      this.clockType = gymClockType.CountDown;
      this.countTo = countTo;
      this.startAt = null;
      this.intervals = null;
      this.period1 = null;
      this.period2 = null;
   };

   GymClockSpec.prototype.setInterval = function (intervals, period1, period2) {

      this.clockType = gymClockType.Interval;
      this.intervals = intervals;
      this.period1 = period1;
      this.period2 = period2;
      this.startAt = null;
      this.countTo = null;
   };

   /**
 * Method that serializes to JSON 
 */
   GymClockSpec.prototype.toJSON = function () {

      return {
         __type: GymClockSpec.prototype.__type,
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

      spec.clockType = data.clockType;
      spec.startAt = data.startAt;
      spec.countTo = data.countTo;
      spec.intervals = data.intervals;
      spec.period1 = data.period1;
      spec.period2 = data.period2;

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
   function GymClock(clock) {
      this.clock = clock;
      this.mm = 0;
      this.ss = 0;
      this.running = false;
   }

   GymClock.prototype.__type = "GymClock";

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   GymClock.prototype.equals = function (rhs) {

      return (this.clock.equals(rhs.clock)
         && this.mm === rhs.hh
         && this.ss === rhs.mm);
   };

   GymClock.prototype.start = function (onTick, onSignalEnd) {
      this.startedAt = new Date();
      this.ticker = setInterval(this.tick.bind(this), 1000); 
      this.onTick = onTick;
      this.onSignalEnd = onSignalEnd;
      this.running = true;

      // call first tick to start the clock
      this.tick();
   };

   GymClock.prototype.stop = function () {
      if (this.ticker) {
         clearInterval(this.ticker);
         this.ticker = null;
      }
      this.running = false;
   };

   GymClock.prototype.startTime = function () {
      return this.startedAt;
   };

   GymClock.prototype.tick = function () {
      var now, mm, ss, seconds;

      switch (this.clock.__type) {
         default:
         case gymClockType.Wall:
            now = new Date();
            mm = Math.floor(now.getMinutes());
            ss = Math.floor(now.getSeconds());
            break;

         case gymClockType.CountUp:
            now = new Date();
            seconds = (now.getTime() - this.startedAt.getTime()) / 1000;
            mm = Math.floor(seconds / 60);
            ss = Math.floor(seconds - Math.floor(mm * 60));
            break;

         case gymClockType.CountDown:
            now = new Date();
            seconds = (now.getTime() - this.startedAt.getTime()) / 1000;
            mm = Math.floor(this.clock.countTo - (Math.floor(seconds / 60)) - 1);
            ss = Math.floor ((this.clock.countTo * 60) - (mm * 60));
            break;

         case gymClockType.Interval:
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

   return GymClock;
}());

//==============================//
// GymClockTick class
//==============================//
var GymClockTick = (function invocation() {
   "use strict";

   /**
    * Create a GymClockTick object
    */
   function GymClockTick(mm, ss) {

      this.mm = mm;
      this.ss = ss;
   }

   GymClockTick.prototype.__type = "GymClockTick";

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   GymClockTick.prototype.equals = function (rhs) {

      return (this.mm === rhs.mm
         && this.ss === rhs.ss);
   };


   /**
    * Method that serializes to JSON 
    */
   GymClockTick.prototype.toJSON = function () {

      return {
         __type: GymClockTick.prototype.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            mm: this.mm,
            ss: this.ss
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revive from 
    */
   GymClockTick.prototype.revive = function (data) {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return GymClockTick.prototype.reviveDb(data.attributes);

      return GymClockTick.prototype.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revive from 
   */
   GymClockTick.prototype.reviveDb = function (data) {

      var tick = new GymClockTick();

      tick.mm = data.mm;
      tick.ss = data.ss;

      return tick;
   };

   return GymClockTick;
}());

//==============================//
// GymClockBeep class
//==============================//
var GymClockBeep = (function invocation() {
   "use strict";

   /**
    * Create a GymClockBeep object
    */
   function GymClockBeep(beepType) {

      this.beepType = beepType;
   }

   GymClockBeep.prototype.__type = "GymClockBeep";

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   GymClockBeep.prototype.equals = function (rhs) {

      return (this.beepType.name === rhs.beepType.name);
   };


   /**
    * Method that serializes to JSON 
    */
   GymClockBeep.prototype.toJSON = function () {

      return {
         __type: GymClockBeep.prototype.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            beepType: this.beepType
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revive from 
    */
   GymClockBeep.prototype.revive = function (data) {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return GymClockBeep.prototype.reviveDb(data.attributes);

      return GymClockBeep.prototype.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revive from 
   */
   GymClockBeep.prototype.reviveDb = function (data) {

      var beep = new GymClockBeep();

      beep.beepType = data.beepType;

      return beep;
   };

   return GymClockBeep;
}());


if (typeof exports == 'undefined') {
   // exports = this['types.js'] = {};
} else { 
   exports.gymClockType = gymClockType;
   exports.gymClockBeepType = gymClockBeepType;
   exports.GymClockSpec = GymClockSpec;
   exports.GymClock = GymClock;
   exports.GymClockTick = GymClockTick;
   exports.GymClockBeep = GymClockBeep;
}
