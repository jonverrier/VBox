/*jslint white: false, indent: 3, maxerr: 1000 */
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2020 */

var _ = require('lodash');

if (typeof exports == 'undefined') {
} else {
   _ = require('lodash');
}

//==============================//
// OnlineClass class
//==============================//
var OnlineClass = (function invocation() {
   "use strict";

   /**
    * Create a Facility object 
    * @param _id - Mongo-DB assigned ID
    * @param externalId - ID assigned by external system (like facebook)*
    * @param particpantChannels - array of IP addresses for participants 
    */
   function OnlineClass(_id, externalId, particpantChannels) {

      this._id = _id;
      this.facilityId = externalId;
      if (particpantChannels)
         this.particpantChannels = particpantChannels.slice();
      else
         this.particpantChannels = null;
   }

   OnlineClass.prototype.__type = "OnlineClass";

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   OnlineClass.prototype.equals = function (rhs) {

      return ((this._id === rhs._id) &&
         (this.facilityId === rhs.facilityId) &&
         _.isEqual(this.particpantChannels, rhs.particpantChannels));
   };

   /**
    * Method that serializes to JSON 
    */
   OnlineClass.prototype.toJSON = function () {

      return {
         __type: OnlineClass.prototype.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _id: this._id,
            facilityId: this.facilityId,
            particpantChannels: this.particpantChannels ? this.particpantChannels.slice() : null
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revove from 
    */
   OnlineClass.prototype.revive = function (data) {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return OnlineClass.prototype.reviveDb(data.attributes);

      return OnlineClass.prototype.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   OnlineClass.prototype.reviveDb = function (data) {

      var onlineClass = new OnlineClass();

      onlineClass._id = data._id;
      onlineClass.facilityId = data.facilityId;

      if (data.particpantChannels)
         onlineClass.particpantChannels = data.particpantChannels.slice();
      else
         onlineClass.particpantChannels = null;

      return onlineClass;
   };

   return OnlineClass;
}());

if (typeof exports == 'undefined') {
   // exports = this['types.js'] = {};
} else { 
   exports.OnlineClass = OnlineClass;
}
