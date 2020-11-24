/*jslint white: false, indent: 3, maxerr: 1000 */
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2020 */


//==============================//
// Facility class
//==============================//
var Facility = (function invocation() {
   "use strict";

  /**
   * Create a Facility object 
   * @param _id - Mongo-DB assigned ID
   * @param externalId - ID assigned by external system (like facebook)
   * @param name - plain text Facility name
   * @param thumbnailUrl - URL to thumbnail image 
   * @param homepageUrl - URL to home page 
   */
   function Facility(_id, externalId, name, thumbnailUrl, homepageUrl) {
      
      this._id = _id;
      this.externalId = externalId;
      this.name = name;
      this.thumbnailUrl = thumbnailUrl;
      this.homepageUrl = homepageUrl;
   }
   
   Facility.prototype.__type = "Facility";

  /**
   * test for equality - checks all fields are the same. 
   * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
   * @param rhs - the object to compare this one to.  
   */
   Facility.prototype.equals = function (rhs) {

      return ((this._id === rhs._id) &&
         (this.externalId === rhs.externalId) &&
         (this.name === rhs.name) &&
         (this.thumbnailUrl === rhs.thumbnailUrl) && 
         (this.homepageUrl === rhs.homepageUrl));
   };

   /**
    * Method that serializes to JSON 
    */
   Facility.prototype.toJSON = function () {

      return {
         __type: Facility.prototype.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _id: this._id,
            externalId: this.externalId,
            name: this.name,
            thumbnailUrl: this.thumbnailUrl,
            homepageUrl: this.homepageUrl
         }
      };
   };

  /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   Facility.prototype.revive = function (data) {
      
      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return Facility.prototype.reviveDb(data.attributes);
      else
         return Facility.prototype.reviveDb(data);
   };
   
   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   Facility.prototype.reviveDb = function (data) {
      
      var facility = new Facility();
      
      facility._id = data._id;
      facility.externalId = data.externalId;
      facility.name = data.name;
      facility.thumbnailUrl = data.thumbnailUrl;
      facility.homepageUrl = data.homepageUrl;
      
      return facility;
   };

   return Facility;
}());


if (typeof exports == 'undefined') {
   // exports = this['types.js'] = {};
} else { 
   exports.Facility = Facility;
}
