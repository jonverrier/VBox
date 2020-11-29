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
// CallParticipant class
//==============================//
var CallParticipant = (function invocation() {
   "use strict";

   /**
    * Create a Facility object 
    * @param _id - Mongo-DB assigned ID
    * @param facilityId - ID for the facility hosting the call
    * @param personId - iD for th call participant 
    */
   function CallParticipant(_id, facilityId, personId) {

      this._id = _id;
      this.facilityId = facilityId;
      this.personId = personId;
   }

   CallParticipant.prototype.__type = "CallParticipant";

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   CallParticipant.prototype.equals = function (rhs) {

      return ((this._id === rhs._id) &&
         (this.facilityId === rhs.facilityId) &&
         (this.personId === rhs.personId));
   };

   /**
    * Method that serializes to JSON 
    */
   CallParticipant.prototype.toJSON = function () {

      return {
         __type: CallParticipant.prototype.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _id: this._id,
            facilityId: this.facilityId,
            personId: this.personId
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revove from 
    */
   CallParticipant.prototype.revive = function (data) {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return CallParticipant.prototype.reviveDb(data.attributes);

      return CallParticipant.prototype.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   CallParticipant.prototype.reviveDb = function (data) {

      var callParticipant = new CallParticipant();

      callParticipant._id = data._id;
      callParticipant.facilityId = data.facilityId;
      callParticipant.personId = data.personId;

      return callParticipant;
   };

   return CallParticipant;
}());

//==============================//
// Call class
//==============================//
var Call = (function invocation() {
   "use strict";

   /**
    * Create a Facility object 
    * @param _id - Mongo-DB assigned ID
    * @param facilityId - ID assigned by external system (like facebook)*
    * @param participants - array of IP addresses for participants 
    */
   function Call(_id, facilityId, participants) {

      this._id = _id;
      this.facilityId = facilityId;
      if (participants)
         this.participants = participants.slice();
      else
         this.participants = null;
   }

   Call.prototype.__type = "Call";

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   Call.prototype.equals = function (rhs) {

      return ((this._id === rhs._id) &&
         (this.facilityId === rhs.facilityId) &&
         _.isEqual(this.participants, rhs.participants));
   };

   /**
    * Method that serializes to JSON 
    */
   Call.prototype.toJSON = function () {

      return {
         __type: Call.prototype.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _id: this._id,
            facilityId: this.facilityId,
            participants: this.participants ? this.participants.slice() : null
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revove from 
    */
   Call.prototype.revive = function (data) {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return Call.prototype.reviveDb(data.attributes);

      return Call.prototype.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   Call.prototype.reviveDb = function (data) {

      var call = new Call();

      call._id = data._id;
      call.facilityId = data.facilityId;

      if (data.participants)
         call.participants = data.participants.slice();
      else
         call.participants = null;

      return call;
   };

   return Call;
}());

if (typeof exports == 'undefined') {
   // exports = this['types.js'] = {};
} else { 
   exports.Call = Call;
   exports.CallParticipant = CallParticipant;
}
