/*! Copyright TXPCo, 2020 */

export class DateWithDays {
   private date: Date;

   constructor();
   constructor(value: number | string);
   constructor(year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number);
   constructor(...args: any[]) {
      if (args.length === 0) {
         this.date = new Date();
      }
      else
      if (args.length === 1) {
         this.date = new Date(args[0]);
      }
      else {
         this.date = new Date(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
      }
   }

   /**
    * Function returns the day of the week in a text format.
    */
   getWeekDay () : string {

      //Create an array containing each day, starting with Sunday.
      var weekdays = new Array(
         "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
      );

      //Use the getDay() method to get the day.
      var day = this.date.getDay();
      // Return the element that corresponds to that index.
      return weekdays[day];
   };
}
