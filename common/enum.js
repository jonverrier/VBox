/*jslint white: false, indent: 3, maxerr: 1000 */
/*global exports*/
/*! Copyright TXPCo, 2020 */


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

const ThreeStateRagEnum = new Enum('Red', 'Amber', 'Green');
const FourStateRagEnum = new Enum('Red', 'Amber', 'Green', 'Indeterminate');

// This goes at the end to avoid circular dependencies - since Types is loaded by many other modules
if (typeof exports == 'undefined') {
   // exports = this['common.js'] = {};
} else {   
   exports.Enum = Enum;
   exports.ThreeStateRagEnum = ThreeStateRagEnum;
   exports.FourStateRagEnum = FourStateRagEnum;
}


