/*jslint white: false, indent: 3, maxerr: 1000 */
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2020 */

var _ = require('lodash');

if (typeof exports == 'undefined') {
} else {
   _ = require('lodash');

   var TypeRegistry = require('../common/types.js').TypeRegistry;
}

//==============================//
// SignalMessage class
//==============================//
var SignalMessage = (function invocation() {
   "use strict";

  /**
   * Create a SignalMessage object 
   * @param _id - Mongo-DB assigned ID
   * @param sessionId - session ID - identifies a single user session
   * @param sequenceNo - message sequence number, climbs nomintonicaly up from 0
   * @param data - data
   */
   function SignalMessage(_id, sessionId, sequenceNo, data) {

      this._id = _id;
      this.sessionId = sessionId;
      this.sequenceNo = sequenceNo;
      this.data = data;
   }
   
   SignalMessage.prototype.__type = "SignalMessage";

  /**
   * test for equality - checks all fields are the same. 
   * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
   * @param rhs - the object to compare this one to.  
   */
   SignalMessage.prototype.equals = function (rhs) {

      return (this._id === rhs._id &&
         (this.sessionId === rhs.sessionId) &&
         (this.sequenceNo === rhs.sequenceNo) &&
         this.data.equals (rhs.data)); 
   };

   /**
    * Method that serializes to JSON 
    */
   SignalMessage.prototype.toJSON = function () {

      return {
         __type: SignalMessage.prototype.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _id: this._id,
            sessionId: this.sessionId,
            sequenceNo: this.sequenceNo,
            data: JSON.stringify (this.data)
         }
      };
   };

  /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   SignalMessage.prototype.revive = function (data) {
      
      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return SignalMessage.prototype.reviveDb(data.attributes);
      else
         return SignalMessage.prototype.reviveDb(data);
   };
   
   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   SignalMessage.prototype.reviveDb = function (data) {
      
      var signalMsg = new SignalMessage();

      signalMsg._id = data._id;
      signalMsg.sessionId = data.sessionId;
      signalMsg.sequenceNo = data.sequenceNo; 

      var types = new TypeRegistry();
      signalMsg.data = types.reviveFromJSON(data.data);
      
      return signalMsg;
   };

   return SignalMessage;
}());


if (typeof exports == 'undefined') {
   // exports = this['types.js'] = {};
} else { 
   exports.SignalMessage = SignalMessage;
}
