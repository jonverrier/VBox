/*jslint white: false, indent: 3, maxerr: 1000 */
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2020 */

var Enum = require('../common/enum.js').Enum;

const clockType = new Enum('Wall', 'CountUp', 'CountDown', 'Interval');

//==============================//
// Clock class
//==============================//
var Clock = (function invocation() {
   "use strict";

  /**
   * Create a Clock object 
   */
   function Clock() {
      this.clockType = clockType.Wall;
   }
   
   Clock.prototype.__type = "Clock";

  /**
   * test for equality - checks all fields are the same. 
   * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
   * @param rhs - the object to compare this one to.  
   */
   Clock.prototype.equals = function (rhs) {

      return (this.clockType === rhs.clockType
         && this.countTo === rhs.countTo
         && this.intervals === rhs.intervals
         && this.period1 === rhs.period1
         && this.period2 === rhs.period2); 
   };

   Clock.prototype.setWall = function () {

      this.clockType = clockType.Wall;
      this.countTo = null;
      this.intervals = null;
      this.period1 = null;
      this.period2 = null;
   };

   Clock.prototype.setCountUp = function (countTo) {

      this.clockType = clockType.CountUp;
      this.countTo = countTo;
      this.intervals = null;
      this.period1 = null;
      this.period2 = null;
   };

   Clock.prototype.setCountDown = function (countTo) {

      this.clockType = clockType.CountDown;
      this.countTo = countTo;
      this.intervals = null;
      this.period1 = null;
      this.period2 = null;
   };

   Clock.prototype.setInterval = function (intervals, period1, period2) {

      this.clockType = clockType.Interval;
      this.intervals = intervals;
      this.period1 = period1;
      this.period2 = period2;
      this.countTo = null;
   };

   return Clock;
}());

//==============================//
// ClockTimer class
//==============================//
var ClockTimer = (function invocation() {
   "use strict";

   /**
    * Create a ClockTimer object 
    */
   function ClockTimer(clock) {
      this.clock = clock;
      this.mm = '00';
      this.ss = '00';
      this.running = false;
   }

   ClockTimer.prototype.__type = "ClockTimer";

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   ClockTimer.prototype.equals = function (rhs) {

      return (this.clock.equals(rhs.clock)
         && this.mm === rhs.hh
         && this.ss === rhs.mm);
   };

   ClockTimer.prototype.start = function (onTick, onSignalEnd) {
      this.start = new Date();

      this.ticker = setInterval(this.tick, 1000); 
      this.onTick = onTick;
      this.onSignalEnd = onSignalEnd;
      this.tick();
   };

   ClockTimer.prototype.stop = function () {
      if (this.ticker) {
         clearInterval(this.ticker);
         this.ticker = null;
      }
   };

   ClockTimer.prototype.startTime = function () {
      return this.start;
   };

   ClockTimer.prototype.tick = function () {
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
            if (this.onTick)
               this.onTick();
            break;
      }
   };

   return ClockTimer;
}());

if (typeof exports == 'undefined') {
   // exports = this['types.js'] = {};
} else { 
   exports.Clock = Clock;
   exports.ClockTimer = ClockTimer;
}
