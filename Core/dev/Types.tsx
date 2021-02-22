
/*! Copyright TXPCo, 2020 */
import { Person } from './Person';

//==============================//
// TypeRegistry class
//==============================//
export class TypeRegistry {

   private _types: any;

   /**
    * Creates a TypeRegistry for use in streaming objects to and from JSON
    */
   constructor() {

      // Registry of types
      this._types = {};
      this._types.Person = Person;
   }

   isObjectKey(key: string): boolean {
      let keyNum = Number(key);
      return key === '' || (!isNaN(keyNum - 0));
   };

   /**
     * Looks up a type name in JSON and returns a constructed object if there is a match
     * @param jsonString - the test to parse for a class 
     */
   reviveFromJSON(jsonString: string) : any {

      var registry = this;

      return JSON.parse(jsonString, function (key, value) {
         if (registry.isObjectKey(key) && value.hasOwnProperty('__type'))
            return registry._types[value.__type].prototype.revive(value);
         else
            return this[key];
      });
   };
}



