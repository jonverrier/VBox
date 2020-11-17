/*jslint white: false, indent: 3, maxerr: 1000 */
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2015 */


//==============================//
// Person class
//==============================//
var Person = (function invocation() {
   "use strict";

  /**
   * Create a Person object 
   * @param _id - Mongo-DB assigned ID
   * @param name - plain text user name
   * @param email - user email
   * @param thumbnailUrl - URL to thumbnail image 
   * @param lastAuthCode - provided by underlying identity system when user logs in
   */
   function Person(_id, name, email, thumbnailUrl, lastAuthCode) {
      
      this._id = _id;
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
            _id : this._id,
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
   Person.revive = function (data) {
      
      // revice data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      return Person.reviveDb (data.attributes);
   };
   
   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   Person.reviveDb = function (data) {
      
      var person = new Person();
      
      person._id = data._id;
      person.name = data.name;
      person.email = data.email;
      person.thumbnailUrl = data.thumbnailUrl;
      person.lastAuthCode = data.lastAuthCode;
      
      return user;
   };

   return Person;
}());

if (typeof require !== 'undefined') {
   exports.Person = Person;
}
