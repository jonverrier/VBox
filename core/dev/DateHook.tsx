/*! Copyright TXPCo, 2020, 2021 */
export class DateHook {
   private static weekdays: Array<string>;
   constructor() {
   }

   private static initialised: boolean = false;

   static initialise(): void {
      if (DateHook.initialised)
         return;

      DateHook.initialised = true;

      //Create an array containing each day, starting with Sunday.
      DateHook.weekdays = new Array<string>(
         "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
      );

      // Warn if overriding existing method
      if ((Date.prototype as any).getWeekDay)
         console.warn("Warning: possible duplicate definition of Date.prototype.getWeekDay.");

      // attach the .getWeekDay method to Date's prototype to call it on any Date
      (Date.prototype as any).getWeekDay = function () {

         //Use the getDay() method to get the day.
         var day = this.getDay();
         // Return the element that corresponds to that index.
         return DateHook.weekdays[day];
      };
   }
}

DateHook.initialise();

