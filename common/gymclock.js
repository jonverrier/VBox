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
   function GymClockSpec(clockEnum, countTo, intervals, period1, period2) {

      if (!clockEnum) {
         this.clockEnum = gymClockType.Wall;
      } else {
         this.clockEnum = clockEnum;
         this.countTo = countTo;
         this.intervals = intervals;
         this.period1 = period1;
         this.period2 = period2;
      }
   }
   
   GymClockSpec.prototype.__type = "GymClockSpec";

  /**
   * test for equality - checks all fields are the same. 
   * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
   * @param rhs - the object to compare this one to.  
   */
   GymClockSpec.prototype.equals = function (rhs) {

      return (this.clockEnum.name === rhs.clockEnum.name
         && this.countTo === rhs.countTo
         && this.intervals === rhs.intervals
         && this.period1 === rhs.period1
         && this.period2 === rhs.period2); 
   };

   GymClockSpec.prototype.isValidWallSpec = function () {

      return (true); 
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

   GymClockSpec.prototype.setWall = function () {

      this.clockEnum = gymClockType.Wall;
   };

   GymClockSpec.prototype.setCountUp = function (countTo) {

      this.clockEnum = gymClockType.CountUp;
      this.countTo = countTo;
   };

   GymClockSpec.prototype.setCountDown = function (countTo) {

      this.clockEnum = gymClockType.CountDown;
      this.countTo = countTo;
   };

   GymClockSpec.prototype.setInterval = function (intervals, period1, period2) {

      this.clockEnum = gymClockType.Interval;
      this.intervals = intervals;
      this.period1 = period1;
      this.period2 = period2;
   };

   /**
 * Method that serializes to JSON 
 */
   GymClockSpec.prototype.toJSON = function () {

      return {
         __type: GymClockSpec.prototype.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            clockEnum: this.clockEnum,
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

      // TODO - find a maintainable way to do this
      if (data.clockEnum.name === gymClockType.Wall.name)
         spec.clockEnum = gymClockType.Wall;
      if (data.clockEnum.name === gymClockType.CountUp.name)
         spec.clockEnum = gymClockType.CountUp;
      if (data.clockEnum.name === gymClockType.CountDown.name)
         spec.clockEnum = gymClockType.CountDown;
      if (data.clockEnum.name === gymClockType.Interval.name)
         spec.clockEnum = gymClockType.Interval;

      spec.clockEnum = data.clockEnum;
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
   function GymClock(clockSpec) {
      this.clockSpec = clockSpec;
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

      return (this.clockSpec.equals(rhs.clockSpec)
         && this.mm === rhs.hh
         && this.ss === rhs.mm);
   };

   GymClock.prototype.start = function (onTick) {
      this.startedAt = new Date();
      this.ticker = setInterval(this.ontick.bind(this), 1000); 
      this.onTick = onTick;
      this.running = true;

      // call first tick to start the clock
      this.ontick();
   };

   GymClock.prototype.stop = function () {
      if (this.ticker) {
         clearInterval(this.ticker);
         this.ticker = null;
      }
      this.onTick = null;
      this.running = false;
   };

   GymClock.prototype.startTime = function () {
      return this.startedAt;
   };

   GymClock.prototype.ontick = function () {
      var now, mm, ss, seconds;

      switch (this.clockSpec.clockEnum) {
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
            if (mm >= this.clockSpec.countTo) {
               mm = this.clockSpec.countTo;
               ss = 0;
               if (this.onTick)
                  this.onTick(mm, ss);
               this.stop();
            }
            break;

         case gymClockType.CountDown:
            now = new Date();
            seconds = (now.getTime() - this.startedAt.getTime()) / 1000;
            mm = Math.floor(this.clockSpec.countTo - (Math.floor(seconds / 60)) - 1);
            ss = Math.floor(((this.clockSpec.countTo - mm) * 60) - seconds);
            if (mm <= 0 && ss <= 0) {
               mm = 0;
               ss = 0;
               if (this.onTick)
                  this.onTick(mm, ss);
               this.stop();
            }
            break;

         case gymClockType.Interval:
            // An interval clock is very similar to a countUp, but repeatedly rounded down by the interval split times.
            now = new Date();
            seconds = (now.getTime() - this.startedAt.getTime()) / 1000;
            mm = Math.floor(seconds / 60);
            ss = Math.floor(seconds - Math.floor(mm * 60));

            for (var i = 0; i < this.clockSpec.intervals; i++) {
               if (mm > this.clockSpec.period1)
                  mm -= this.clockSpec.period1;
               if (mm > this.clockSpec.period2)
                  mm -= this.clockSpec.period2;
            }
            if (seconds >= (this.clockSpec.intervals * (this.clockSpec.period1 + this.clockSpec.period2) * 60)) {
               mm = Math.floor (this.clockSpec.intervals * (this.clockSpec.period1 + this.clockSpec.period2));
               ss = 0;
               if (this.onTick)
                  this.onTick(mm, ss);
               this.stop();
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
// GymClockTick class harry is the best
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
