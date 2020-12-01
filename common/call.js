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
    * @param personId - iD for the call participant 
    * @param sessionId - iD for the call session (in case same person joins > once)
    */
   function CallParticipant(_id, facilityId, personId, sessionId) {

      this._id = _id;
      this.facilityId = facilityId;
      this.personId = personId;
      this.sessionId = sessionId;
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
         (this.personId === rhs.personId) &&
         (this.sessionId === rhs.sessionId));
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
            personId: this.personId,
            sessionId: this.sessionId
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
      callParticipant.sessionId = data.sessionId;

      return callParticipant;
   };

   return CallParticipant;
}());

//==============================//
// CallOffer class
//==============================//
var CallOffer = (function invocation() {
   "use strict";

   /**
    * Create a Facility object 
    * @param _id - Mongo-DB assigned ID
    * @param from - CallParticipant
    * @param to - CallParticipant
    * @param offer - the WebRTC Offer 
    */
   function CallOffer(_id, from, to, offer) {

      this._id = _id;
      this.from = from;
      this.to = to;
      this.offer = offer;
   }

   CallOffer.prototype.__type = "CallOffer";

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   CallOffer.prototype.equals = function (rhs) {

      return ((this._id === rhs._id) &&
         (this.from.equals(rhs.from)) &&
         (this.to.equals(rhs.to)) &&
         (this.offer === rhs.offer));
   };

   /**
    * Method that serializes to JSON 
    */
   CallOffer.prototype.toJSON = function () {

      return {
         __type: CallOffer.prototype.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _id: this._id,
            from: this.from,
            to: this.to,
            offer: this.offer
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revove from 
    */
   CallOffer.prototype.revive = function (data) {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return CallOffer.prototype.reviveDb(data.attributes);

      return CallOffer.prototype.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   CallOffer.prototype.reviveDb = function (data) {

      var callOffer = new CallOffer();

      callOffer._id = data._id;
      callOffer.from = CallParticipant.prototype.revive(data.from);
      callOffer.to = CallParticipant.prototype.revive(data.to);
      callOffer.offer = data.offer;

      return callOffer;
   };

   return CallOffer;
}());

//==============================//
// CallAnswer class
//==============================//
var CallAnswer = (function invocation() {
   "use strict";

   /**
    * Create a Facility object 
    * @param _id - Mongo-DB assigned ID
    * @param from - CallParticipant
    * @param to - CallParticipant
    * @param answer - the WebRTC Answer 
    */
   function CallAnswer(_id, from, to, answer) {

      this._id = _id;
      this.from = from;
      this.to = to;
      this.answer = answer;
   }

   CallAnswer.prototype.__type = "CallAnswer";

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   CallAnswer.prototype.equals = function (rhs) {

      return ((this._id === rhs._id) &&
         (this.from.equals(rhs.from)) &&
         (this.to.equals(rhs.to)) &&
         (this.answer === rhs.answer));
   };

   /**
    * Method that serializes to JSON 
    */
   CallAnswer.prototype.toJSON = function () {

      return {
         __type: CallAnswer.prototype.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _id: this._id,
            from: this.from,
            to: this.to,
            answer: this.answer
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revove from 
    */
   CallAnswer.prototype.revive = function (data) {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return CallAnswer.prototype.reviveDb(data.attributes);

      return CallAnswer.prototype.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   CallAnswer.prototype.reviveDb = function (data) {

      var callAnswer = new CallAnswer();

      callAnswer._id = data._id;
      callAnswer.from = CallParticipant.prototype.revive(data.from);
      callAnswer.to = CallParticipant.prototype.revive(data.to);
      callAnswer.answer = data.answer;

      return callAnswer;
   };

   return CallAnswer;
}());

//==============================//
// CallIceCandidate class
//==============================//
var CallIceCandidate = (function invocation() {
   "use strict";

   /**
    * Create a Facility object 
    * @param _id - Mongo-DB assigned ID
    * @param from - CallParticipant
    * @param to - CallParticipant
    * @param ice - the WebRTC ice 
    * @param outbound - TRUE if this is from an outbound (Offer) connection
    */
   function CallIceCandidate (_id, from, to, ice, outbound) {

      this._id = _id;
      this.from = from;
      this.to = to;
      this.ice = ice;
      this.outbound = outbound;
   }

   CallIceCandidate.prototype.__type = "CallIceCandidate";

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   CallIceCandidate.prototype.equals = function (rhs) {

      return ((this._id === rhs._id) &&
         (this.from.equals(rhs.from)) &&
         (this.to.equals(rhs.to)) &&
         (this.ice === rhs.ice) &&
         (this.outbound === rhs.outbound));
   };

   /**
    * Method that serializes to JSON 
    */
   CallIceCandidate.prototype.toJSON = function () {

      return {
         __type: CallIceCandidate.prototype.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _id: this._id,
            from: this.from,
            to: this.to,
            ice: this.ice,
            outbound: this.outbound
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revove from 
    */
   CallIceCandidate.prototype.revive = function (data) {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return CallIceCandidate.prototype.reviveDb(data.attributes);

      return v.prototype.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   CallIceCandidate.prototype.reviveDb = function (data) {

      var callIceCandidate = new CallIceCandidate();

      callIceCandidate._id = data._id;
      callIceCandidate.from = CallParticipant.prototype.revive(data.from);
      callIceCandidate.to = CallParticipant.prototype.revive(data.to);
      callIceCandidate.ice = data.ice;
      callIceCandidate.outbound = data.outbound; 

      return callIceCandidate;
   };

   return CallIceCandidate;
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
   exports.CallOffer = CallOffer;
   exports.CallAnswer = CallAnswer;
   exports.CallIceCandidate = CallIceCandidate;
}
