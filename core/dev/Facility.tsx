/*! Copyright TXPCo, 2020, 2021 */

import { IStreamableFor } from './Streamable';

export class Facility implements IStreamableFor<Facility>  {
   private _id: any;
   private _externalId: string;
   private _name: string;
   private _thumbnailUrl: string;
   private _homepageUrl: string;

   static readonly __type: string = "Facility";

   /**
    * Create a Person object
    * @param _id - Mongo-DB assigned ID
    * @param externalId - ID assigned by external system (like facebook)
    * @param name - plain text user name
    * @param thumbnailUrl - URL to thumbnail image
    * @param lastAuthCode - provided by underlying identity system when user logs in
    */
   constructor(_id: any, externalId: string, name: string, thumbnailUrl: string, homepageUrl: string) {
      this._id = _id;
      this._externalId = externalId;
      this._name = name;
      this._thumbnailUrl = thumbnailUrl;
      this._homepageUrl = homepageUrl;
   }

   /**
   * set of 'getters' for private variables
   */
   get id(): any {
      return this._id;
   }
   get externalId(): string {
      return this._externalId;
   }
   get name(): string {
      return this._name;
   }
   get thumbnailUrl(): string {
      return this._thumbnailUrl;
   }
   get homepageUrl(): string {
      return this._homepageUrl;
   }
   get type(): string {
      return Facility.__type;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Facility): boolean {

      return ((this._id === rhs._id) &&
         (this._externalId === rhs._externalId) &&
         (this._name === rhs._name) &&
         (this._thumbnailUrl === rhs._thumbnailUrl) &&
         (this._homepageUrl === rhs._homepageUrl));
   };

   /**
    * Method that serializes to JSON 
    */
   toJSON(): Object {

      return {
         __type: Facility.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _id: this._id,
            _externalId: this._externalId,
            _name: this._name,
            _thumbnailUrl: this._thumbnailUrl,
            _homepageUrl: this._homepageUrl
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revove from 
    */
   static revive(data: any): Facility {

      // revice data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return Facility.reviveDb(data.attributes);
      else
         return Facility.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   static reviveDb(data: any): Facility {

      return new Facility(data._id,
         data._externalId,
         data._name,
         data._thumbnailUrl,
         data._homepageUrl);
   };
};

