/*jslint white: false, indent: 3, maxerr: 1000 */
/*global exports*/
/*! Copyright TXPCo, 2020 */

var facilityModule = null;
var personModule = null;
var onlineClassModule = null;
var homePageModule = null;

//==============================//
// TypeRegistry class
//==============================//
var TypeRegistry = (function invocation() {
   "use strict";

   /**
    * Creates a TypeRegistry for use in streaming objects to and from JSON 
    */
   function TypeRegistry() {

      // Registry of types
      this.types = {};
      if (facilityModule === null) {
         this.types.Facility = Facility;
         this.types.Person = Person;
         this.types.HomePageData = HomePageData;     
         this.types.OnlineClass = OnlineClass;
      } else {
         this.types.Facility = facilityModule.Facility;
         this.types.Person = personModule.Person;
         this.types.HomePageData = homePageModule.HomePageData;
         this.types.OnlineClass = onlineClassModule.OnlineClass;
      }
   }
   
   TypeRegistry.prototype.isObjectKey = function (key) {
      return key === '' || (!isNaN(key - 0));
   };

   /**
     * Looks up a type name in JSON and returns a constructed object if there is a match
     * @param string - the classname key to lookup 
     */
   TypeRegistry.prototype.reviveFromJSON = function (string) {

      var registry = this;

      return JSON.parse(string, function (key, value) {
         if (registry.isObjectKey(key) && value.hasOwnProperty('__type'))
            return registry.types[value.__type].prototype.revive(value);
         else
            return this[key];
      });
   };
   return TypeRegistry;
}());

//==============================//
// Symbol class - used  by Enum class
//==============================//
var Symbol = (function invocation() {
   "use strict";
   
   /**
    * Creates a Symbol 
    * @param name - the names of the symbol 
    * @param props - the properties of the symbol
    */
   function Symbol(name, props) {
      
      this.name = name;
      if (props) {
         this.copyOwnFrom(this, props);
      }
      Object.freeze(this);
   }
   
   /**
    * Private function internal use only. 
    * Copyies members over so the enum has its own set of values
    * @param target - where to copy to 
    * @param source - where to copy from
    */
   Symbol.prototype.copyOwnFrom = function (target, source) {
      
      Object.getOwnPropertyNames(source).forEach(function (propName) {
         Object.defineProperty(target, propName,
             Object.getOwnPropertyDescriptor(source, propName));
      });
      return target;
   };
   
   return Symbol;
})();

//==============================//
// Enum class
//==============================//
var Enum = (function invocation() {
   "use strict";
   
   /**
    * Creates an enumeration
    * @param obj - an immediate list of text values to use as enumation values e.g. 'One', 'Two', 'Three'. 
    */
   function Enum(obj) {
      
      if (arguments.length === 1 && obj !== null && typeof obj === "object") {
         Object.keys(obj).forEach(function (name) {
            this[name] = new Symbol(name, obj[name]);
         }, this);
      } else {
         Array.prototype.forEach.call(arguments, function (name) {
            this[name] = new Symbol(name);
         }, this);
      }
      Object.freeze(this);
   }
   
   /**
    * returns true if the enumeration contains the value
    * @param sym - value to test if it is inside the enumeration 
    */
   Enum.prototype.contains = function (sym) {
      
      if (!(sym instanceof Symbol)) {
         return false;
      }
      
      return this[sym.name] === sym;
   };
   
   /**
    * returns true if the enumeration contains the value
    * @param string - value to test if it is inside the enumeration 
    */
   Enum.prototype.containsString = function (string) {
      
      var symbol = new Symbol(string),
         symbolname = this[symbol.name];
      
      if (symbolname) {
         return true;
      } else {
         return false;
      }
   };
   
   /**
    * gets the symbol with the specified value. 
    * @param string - value to test if it is inside the enumeration 
    */
   Enum.prototype.getSymbol = function (string) {
      
      if (this.containsString(string)) {
         var symbol = new Symbol(string),
            symbolname = this[symbol.name];
         
         return symbolname;
      } else {
         return null;
      }
   };
   
   return Enum;
})();

// This goes at the end to avoid circular dependencies - since Types is loaded by many other modules
if (typeof exports == 'undefined') {
   // exports = this['common.js'] = {};
} else {   
   exports.Enum = Enum;
   exports.TypeRegistry = TypeRegistry;

   facilityModule = require('./facility.js');
   personModule = require('./person.js');
   homePageModule = require('./homepagedata.js');
   onlineClassModule = require('./onlineclass.js');
}


