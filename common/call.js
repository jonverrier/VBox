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
// CallParticipation class
//==============================//
var CallParticipation = (function invocation() {
   "use strict";

   /**
    * Create a CallParticipation object
    * @param _id - Mongo-DB assigned ID
    * @param facilityId - ID for the facility hosting the call
    * @param personId - iD for the call participant 
    * @param sessionId - iD for the call session (in case same person joins > once)
    * @param sessionSubId - iD for the call session (in case same person joins > once from same browser)
    */
   function CallParticipation(_id, facilityId, personId, sessionId, sessionSubId) {

      this._id = _id;
      this.facilityId = facilityId;
      this.personId = personId;
      this.sessionId = sessionId;
      this.sessionSubId = sessionSubId;
   }

   CallParticipation.prototype.__type = "CallParticipation";

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   CallParticipation.prototype.equals = function (rhs) {

      return ((this._id === rhs._id) &&
         (this.facilityId === rhs.facilityId) &&
         (this.personId === rhs.personId) &&
         (this.sessionId === rhs.sessionId) && 
         (this.sessionSubId === rhs.sessionSubId));
   };

   /**
    * Method that serializes to JSON 
    */
   CallParticipation.prototype.toJSON = function () {

      return {
         __type: CallParticipation.prototype.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _id: this._id,
            facilityId: this.facilityId,
            personId: this.personId,
            sessionId: this.sessionId,
            sessionSubId: this.sessionSubId
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revove from 
    */
   CallParticipation.prototype.revive = function (data) {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return CallParticipation.prototype.reviveDb(data.attributes);

      return CallParticipation.prototype.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   CallParticipation.prototype.reviveDb = function (data) {

      var callParticipation = new CallParticipation();

      callParticipation._id = data._id;
      callParticipation.facilityId = data.facilityId;
      callParticipation.personId = data.personId;
      callParticipation.sessionId = data.sessionId;
      callParticipation.sessionSubId = data.sessionSubId;

      return callParticipation;
   };

   return CallParticipation;
}());

//==============================//
// CallOffer class
//==============================//
var CallOffer = (function invocation() {
   "use strict";

   /**
    * Create a CallOffer object
    * @param _id - Mongo-DB assigned ID
    * @param from - CallParticipation
    * @param to - CallParticipation
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
      callOffer.from = CallParticipation.prototype.revive(data.from);
      callOffer.to = CallParticipation.prototype.revive(data.to);
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
    * Create a CallAnswer object
    * @param _id - Mongo-DB assigned ID
    * @param from - CallParticipation
    * @param to - CallParticipation
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
      callAnswer.from = CallParticipation.prototype.revive(data.from);
      callAnswer.to = CallParticipation.prototype.revive(data.to);
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
    * Create a CallIceCandidate object
    * @param _id - Mongo-DB assigned ID
    * @param from - CallParticipation
    * @param to - CallParticipation
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

      return CallIceCandidate.prototype.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   CallIceCandidate.prototype.reviveDb = function (data) {

      var callIceCandidate = new CallIceCandidate();

      callIceCandidate._id = data._id;
      callIceCandidate.from = CallParticipation.prototype.revive(data.from);
      callIceCandidate.to = CallParticipation.prototype.revive(data.to);
      callIceCandidate.ice = data.ice;
      callIceCandidate.outbound = data.outbound; 

      return callIceCandidate;
   };

   return CallIceCandidate;
}());

//==============================//
// CallKeepAlive class
//==============================//
var CallKeepAlive = (function invocation() {
   "use strict";

   /**
    * Create a CallKeepAlive object
    */
   function CallKeepAlive(_id) {

      this._id = _id;
   }

   CallKeepAlive.prototype.__type = "CallKeepAlive";

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   CallKeepAlive.prototype.equals = function (rhs) {

      return ((this._id === rhs._id));
   };

   /**
    * Method that serializes to JSON 
    */
   CallKeepAlive.prototype.toJSON = function () {

      return {
         __type: CallKeepAlive.prototype.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _id: this._id,
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revove from 
    */
   CallKeepAlive.prototype.revive = function (data) {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return CallKeepAlive.prototype.reviveDb(data.attributes);

      return CallKeepAlive.prototype.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   CallKeepAlive.prototype.reviveDb = function (data) {

      var callKeepAlive = new CallKeepAlive();

      callKeepAlive._id = data._id;

      return callKeepAlive;
   };

   return CallKeepAlive;
}());

//==============================//
// Call class
//==============================//
var Call = (function invocation() {
   "use strict";

   /**
    * Create a Facility object 
    * @param _id - Mongo-DB assigned ID
    * @param facilityId - ID assigned by external system (like facebook,
    * @param participants - array of Participants 
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
   exports.CallParticipation = CallParticipation;
   exports.CallOffer = CallOffer;
   exports.CallAnswer = CallAnswer;
   exports.CallIceCandidate = CallIceCandidate;
   exports.CallKeepAlive = CallKeepAlive;
}
