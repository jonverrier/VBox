/*jslint white: false, indent: 3, maxerr: 1000 */
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2020 */

var TypeRegistry = require('../common/types.js').TypeRegistry;

//==============================//
// Whiteboard class
//==============================//
var Whiteboard = (function invocation() {
   "use strict";

  /**
   * Create a Whiteboard object

   */
   function Whiteboard(workout, results) {
      
      this.workout = workout;
      this.results = results;
   }
   
   Whiteboard.prototype.__type = "Whiteboard";

  /**
   * test for equality - checks all fields are the same. 
   * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
   * @param rhs - the object to compare this one to.  
   */
   Whiteboard.prototype.equals = function (rhs) {

      return (
         (this.workout.equals(rhs.workout)) &&
         (this.results.equals(rhs.results)));
   };

   /**
    * Method that serializes to JSON 
    */
   Whiteboard.prototype.toJSON = function () {

      return {
         __type: Whiteboard.prototype.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            workout: JSON.stringify(this.workout),
            results: JSON.stringify(this.results)
         }
      };
   };

  /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   Whiteboard.prototype.revive = function (data) {
      
      // revice data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return Whiteboard.prototype.reviveDb(data.attributes);
      else
         return Whiteboard.prototype.reviveDb(data);
   };
   
   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   Whiteboard.prototype.reviveDb = function (data) {
      
      var whiteboard = new Whiteboard();

      var types = new TypeRegistry();
      whiteboard.workout = types.reviveFromJSON(data.workout);
      whiteboard.results = types.reviveFromJSON(data.results);
      
      return whiteboard;
   };

   return Whiteboard;
}());

if (typeof exports == 'undefined') {
   // exports = this['types.js'] = {};
} else { 
   exports.Whiteboard = Whiteboard;
}
