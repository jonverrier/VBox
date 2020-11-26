/*jslint white: false, indent: 3, maxerr: 1000 */
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2020 */

var _ = require('lodash');

if (typeof exports == 'undefined') {
} else {
   _ = require('lodash');
   var facilityModule = require('../common/facility.js');
   var Facility = facilityModule.Facility;
}

//==============================//
// HomePageData class
//==============================//
var HomePageData = (function invocation() {
   "use strict";

  /**
   * Create a HomePageData object 
   * @param personName - name for current user
   * @param personThumbnailUrl - URL to thumbnail image for current user
   * @param currentFacility - the current facility where the user is logged in
   * @param facilities - array of all facilities where the user has a role
   *
   */
   function HomePageData(personName, personThumbnailUrl, currentFacility, facilities) {

      this.personName = personName;
      this.personThumbnailUrl = personThumbnailUrl;
      this.currentFacility = currentFacility;
      if (facilities)
         this.facilities = facilities.slice();
      else
         this.facilities = null;
   }
   
   HomePageData.prototype.__type = "HomePageData";

  /**
   * test for equality - checks all fields are the same. 
   * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
   * @param rhs - the object to compare this one to.  
   */
   HomePageData.prototype.equals = function (rhs) {

      return (this.personName === rhs.personName &&
         this.personThumbnailUrl === rhs.personThumbnailUrl &&
         this.currentFacility.equals (rhs.currentFacility) &&
         _.isEqual(this.facilities, rhs.facilities)); 
   };

   /**
    * Method that serializes to JSON 
    */
   HomePageData.prototype.toJSON = function () {

      return {
         __type: HomePageData.prototype.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            personName: this.personName,
            personThumbnailUrl: this.personThumbnailUrl,
            currentFacility: this.currentFacility,
            facilities: this.facilities ? this.facilities.slice() : null
         }
      };
   };

  /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   HomePageData.prototype.revive = function (data) {
      
      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return HomePageData.prototype.reviveDb(data.attributes);
      else
         return HomePageData.prototype.reviveDb(data);
   };
   
   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   HomePageData.prototype.reviveDb = function (data) {
      
      var pageData = new HomePageData();

      pageData.personName = data.personName;
      pageData.personThumbnailUrl = data.personThumbnailUrl;   

      pageData.currentFacility = Facility.prototype.revive(data.currentFacility); 

      if (data.facilities) {
         pageData.facilities = new Array(data.facilities.length);
         for (var i = 0; i < data.facilities.length; i++) {
            pageData.facilities[i] = Facility.prototype.revive(data.facilities[i]);
         }
      }
      else
         pageData.facilities = null;
      
      return pageData;
   };

   return HomePageData;
}());


if (typeof exports == 'undefined') {
   // exports = this['types.js'] = {};
} else { 
   exports.HomePageData = HomePageData;
}
