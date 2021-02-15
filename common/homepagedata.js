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

   var personModule = require('../common/person.js');
   var Person = personModule.Person;
}

//==============================//
// HomePageData class
//==============================//
var HomePageData = (function invocation() {
   "use strict";

  /**
   * Create a HomePageData object 
   * @param sessionId - session ID - is sent back to the client, allows client to restart interrupted comms as long as within TTL
   * @param person - object for current user
   * @param currentFacility - the current facility where the user is logged in
   * @param facilities - array of all facilities where the user has a role
   *
   */
   function HomePageData(sessionId, person, currentFacility, facilities) {

      this.sessionId = sessionId;
      this.person = person;
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

      return (this.sessionId === rhs.sessionId &&
         this.person.equals(rhs.person) &&
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
            sessionId: this.sessionId,
            person: this.person,
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

      pageData.sessionId = data.sessionId;
      pageData.person = Person.prototype.revive(data.person);

      if (data.currentFacility) {
         pageData.currentFacility = Facility.prototype.revive(data.currentFacility);
      } else {
         pageData.currentFacility = new Facility(null, null, 'Unknown', 'building-black128x128.png', null);
      }

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
