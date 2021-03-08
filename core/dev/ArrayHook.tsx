/*! Copyright TXPCo, 2020, 2021 */
// Hooks the Array class so it has an 'equals' method.

export class ArrayHook  {
   constructor() {

   }
   private static initialised: boolean = false;

   static initialise(): void {
      if (ArrayHook.initialised)
         return;

      ArrayHook.initialised = true;

      // Warn if overriding existing method
      if ((Array.prototype as any).equals)
         console.warn("Warning: possible duplicate definition of Array.prototype.equals.");

      // attach the .equals method to Array's prototype to call it on any array
      (Array.prototype as any).equals = function (array) {
         // if the other array is a falsy value, return
         if (!array)
            return false;

         // compare lengths - can save a lot of time 
         if (this.length != array.length)
            return false;

         for (var i = 0, l = this.length; i < l; i++) {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
               // recurse into the nested arrays
               if (!this[i].equals(array[i]))
                  return false;
            }
            else if (this[i].equals) {
               // If the objects have an equals method, use it
               return (this[i].equals (array[i]));
            }
            else if (this[i] != array[i]) {
               // Warning - two different object instances will never be equal: {x:20} != {x:20}
               return false;
            }
         }
         return true;
      }
      // Hide method from for-in loops
      Object.defineProperty(Array.prototype, "equals", { enumerable: false });
   }
}

ArrayHook.initialise();