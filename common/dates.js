/*jslint white: false, indent: 3, maxerr: 1000 */
/*global exports*/
/*! Copyright TXPCo, 2020 */


//==============================//
// DateUtility class
//==============================//
var DateUtility = (function invocation() {
   "use strict";
   
   /**
    * Creates a DateUtility
    * @param date - the date object to use - can be null, in which case the class creates its own via now() 
    */
   function DateUtility(date) {
      if (!date)
         date = new Date();
      this.date = date;
   }
   
   /**
    * Function takes in a Date object and returns the day of the week in a text format.
    */
   DateUtility.prototype.getWeekDay = function () {
      
      //Create an array containing each day, starting with Sunday.
      var weekdays = new Array(
         "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
      );

      //Use the getDay() method to get the day.
      var day = this.date.getDay();
      //Return the element that corresponds to that index.
      return weekdays[day];
   };
   
   return DateUtility;
})();


if (typeof exports == 'undefined') {
   // exports = this['common.js'] = {};
} else {   
   exports.DateUtility = DateUtility;
}


