/*jslint white: false, indent: 3, maxerr: 1000 */
/*global console*/
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2020 */

//==============================//
// Session class
// Used to store & retrieve Sessions from database
//==============================//
var Session = (function invocation() {
   "use strict";

   /**
    * Create a Session object 
    * @param _id - Mongo-DB assigned ID
    * @param facility - facility name (unique)
    * @param email - user email
    * @param sessionId - string with the session ID.
    * @param lastAccess - a Date() object with the timestamp of last access* 
    */
   function Session(_id, 
      facility, email, sessionId, lastAccess) {
        
      if (_id) // Only set _id if it is non-null, this allows Mongo to insert a new record if we don't have a key set
         this._id = _id;
      this.facility = facility;
      this.email = email;
      this.sessionId = sessionId;
      this.lastAccess = lastAccess;
   }

   Session.prototype.__type = "Session";

  /**
   * test for equality - checks all fields are the same. 
   * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
   * @param rhs - the object to compare this one to.  
   */
   Session.prototype.equals = function (rhs) {

      return ((this._id === rhs._id) &&
         (this.facility === rhs.facility) &&
         (this.email === rhs.email) &&
         (this.sessionId === rhs.sessionId) &&
         (this.lastAccess.getTime() === rhs.lastAccess.getTime()));
   };
   
   
   /**
    * Method that serializes to JSON 
    */
   Session.prototype.toJSON = function () {
      
      return {
         __type: Session.prototype.__type,
         _id : this._id,
         facility: this.facility,
         email: this.email,
         sessionId: this.sessionId,
         lastAccess: this.lastAccess
      };
   };
   
   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   Session.revive = function (data) { 
      
      var session = new Session(data._id, 
         data.facility, data.email, data.role, data.sessionId, new Date(data.lastAccess));
      
      return session;
   };

   return Session;
}());

if (typeof require == 'undefined') {
} else {
   exports.Session = Session;
}
