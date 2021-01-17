/*jslint white: false, indent: 3, maxerr: 1000 */
/*global exports*/
/*! Copyright TXPCo, 2020 */

var facilityModule = null;
var personModule = null;
var callModule = null;
var signalModule = null;
var homePageModule = null;
var clockModule = null;

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
         this.types.CallParticipation = CallParticipation;     
         this.types.CallOffer = CallOffer;  
         this.types.CallAnswer = CallAnswer;   
         this.types.CallIceCandidate = CallIceCandidate;  
         this.types.CallKeepAlive = CallKeepAlive;
         this.types.Call = Call;
         this.types.SignalMessage = SignalMessage;
         this.types.WorkoutClockSpec = WorkoutClockSpec;
      } else {
         this.types.Facility = facilityModule.Facility;
         this.types.Person = personModule.Person;
         this.types.HomePageData = homePageModule.HomePageData;
         this.types.CallParticipation = callModule.CallParticipation;  
         this.types.CallOffer = callModule.CallOffer; 
         this.types.CallAnswer = callModule.CallAnswer; 
         this.types.CallIceCandidate = callModule.CallIceCandidate; 
         this.types.CallKeepAlive = callModule.CallKeepAlive;
         this.types.Call = callModule.Call;
         this.types.SignalMessage = signalModule.SignalMessage;
         this.types.WorkoutClockSpec = clockModule.WorkoutClockSpec;
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

// This goes at the end to avoid circular dependencies - since Types is loaded by many other modules
if (typeof exports == 'undefined') {
   // exports = this['common.js'] = {};
} else {   
   exports.TypeRegistry = TypeRegistry;

   facilityModule = require('./facility.js');
   personModule = require('./person.js');
   homePageModule = require('./homepagedata.js');
   callModule = require('./call.js');
   signalModule = require('./signal.js');
   clockModule = require('./workout-clock.js');
}


