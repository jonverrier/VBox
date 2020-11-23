/*jslint white: false, indent: 3, maxerr: 1000 */
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2020 */

//==============================//
// Person class
//==============================//
var Person = (function invocation() {
   "use strict";

  /**
   * Create a Person object 
   * @param _id - Mongo-DB assigned ID
   * @param externalId - ID assigned by external system (like facebook)
   * @param name - plain text user name
   * @param email - user email
   * @param thumbnailUrl - URL to thumbnail image 
   * @param lastAuthCode - provided by underlying identity system when user logs in
   */
   function Person(_id, externalId, name, email, thumbnailUrl, lastAuthCode) {
      
      this._id = _id;
      this.externalId = externalId;
      this.name = name;
      this.email = email;
      this.thumbnailUrl = thumbnailUrl;
      this.lastAuthCode = lastAuthCode;
   }
   
   Person.prototype.__type = "Person";

  /**
   * test for equality - checks all fields are the same. 
   * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
   * @param rhs - the object to compare this one to.  
   */
   Person.prototype.equals = function (rhs) {

      return ((this._id === rhs._id) &&
         (this.externalId === rhs.externalId) &&
         (this.name === rhs.name) &&
         (this.email === rhs.email) &&
         (this.thumbnailUrl === rhs.thumbnailUrl) &&
         (this.lastAuthCode === rhs.lastAuthCode));
   };

   /**
    * Method that serializes to JSON 
    */
   Person.prototype.toJSON = function () {

      return {
         __type: Person.prototype.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _id: this._id,
            externalId: this.externalId,
            name: this.name,
            email: this.email,
            thumbnailUrl: this.thumbnailUrl,
            lastAuthCode: this.lastAuthCode
         }
      };
   };

  /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   Person.prototype.revive = function (data) {
      
      // revice data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return Person.prototype.reviveDb(data.attributes);
      else
         return Person.prototype.reviveDb(data);
   };
   
   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   Person.prototype.reviveDb = function (data) {
      
      var person = new Person();
      
      person._id = data._id;
      person.externalId = data.externalId;
      person.name = data.name;
      person.email = data.email;
      person.thumbnailUrl = data.thumbnailUrl;
      person.lastAuthCode = data.lastAuthCode;
      
      return person;
   };

   return Person;
}());

if (typeof exports == 'undefined') {
   // exports = this['types.js'] = {};
} else { 
   exports.Person = Person;
}
