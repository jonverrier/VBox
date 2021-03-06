/*jslint white: false, indent: 3, maxerr: 1000 */
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2020, 2021 */

import { IStreamableFor } from './Streamable';

import { Person } from './Person';
import { Facility } from './Facility';
import { isEqual } from './Equals';

//==============================//
// UserFacilities class
//==============================//
export class UserFacilities implements IStreamableFor<UserFacilities> {

   private _sessionId: string;
   private _person: Person;
   private _currentFacility: Facility;
   private _zoomSignature: string;
   private _facilities: Array<Facility>;

   static readonly __type = "UserFacilities";

  /**
   * Create a HomePageData object 
   * @param sessionId - session ID - is sent back to the client, allows client to restart interrupted comms as long as within TTL
   * @param person - object for current user
   * @param currentFacility - the current facility where the user is logged in
   * @param zoomSignature - signature to use to start Zoom
   * @param facilities - array of all facilities where the user has a role
   *
   */
   constructor(sessionId, person, currentFacility, zoomSignature, facilities: Array<Facility> = new Array<Facility>()) {

      this._sessionId = sessionId;
      this._person = person;
      this._currentFacility = currentFacility;
      this._zoomSignature = zoomSignature;
      this._facilities = facilities;
   }

   /**
   * set of 'getters' for private variables
   */
   get sessionId(): any {
      return this._sessionId;
   }
   get person(): Person {
      return this._person;
   }
   get currentFacility(): Facility {
      return this._currentFacility;
   }
   get facilities(): Array<Facility> {
      return this._facilities;
   }
   get zoomSignature(): string {
      return this._zoomSignature;
   }
   get type(): string {
      return UserFacilities.__type;
   }

  /**
   * test for equality - checks all fields are the same. 
   * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
   * @param rhs - the object to compare this one to.  
   */
   equals(rhs: UserFacilities): boolean {

      return (this._sessionId === rhs._sessionId &&
         this._person.equals(rhs._person) &&
         this._currentFacility.equals(rhs._currentFacility) &&
         this._zoomSignature === rhs._zoomSignature &&
         isEqual(this._facilities, rhs._facilities)); 
   };

   /**
    * Method that serializes to JSON 
    */
   toJSON(): any {

      let facilities = new Array<Object> (this._facilities.length);
      for (var i = 0; i < this._facilities.length; i++) {
         facilities[i] = this._facilities[i].toJSON();
      }

      return {
         __type: UserFacilities.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _sessionId: this._sessionId,
            _person: this._person.toJSON(),
            _currentFacility: this._currentFacility.toJSON(),
            _zoomSignature: this._zoomSignature,
            _facilities: facilities
         }
      };
   };

  /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   static revive(data: any): UserFacilities {
      
      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return UserFacilities.reviveDb(data.attributes);
      else
         return UserFacilities.reviveDb(data);
   };
   
   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   static reviveDb(data: any): UserFacilities {

      let facilities = new Array<Facility>();

      if (data._facilities) {
         facilities.length = data._facilities.length;
         for (var i = 0; i < data._facilities.length; i++) {
            facilities[i] = Facility.revive(data._facilities[i]);
         }
      }

      return new UserFacilities(data._sessionId,
         Person.revive(data._person),
         data._currentFacility ? Facility.revive(data._currentFacility)
            : new Facility(null, "", 'Unknown', 'building-black128x128.png', "(No homepage)"),
         data._zoomSignature,
         facilities);
   }
}

