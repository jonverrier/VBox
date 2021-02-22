/*jslint white: false, indent: 3, maxerr: 1000 */
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2020 */

export class Person {
   private _id: string; 
   private _externalId : string;
   private _name: string;
   private _email: string;
   private _thumbnailUrl: string;
   private _lastAuthCode: string;

   static readonly __type: string = "Person";

/**
 * Create a Person object
 * @param _id - Mongo-DB assigned ID
 * @param externalId - ID assigned by external system (like facebook)
 * @param name - plain text user name
 * @param email - user email
 * @param thumbnailUrl - URL to thumbnail image
 * @param lastAuthCode - provided by underlying identity system when user logs in
 */
   constructor(_id, externalId, name, email, thumbnailUrl, lastAuthCode) {
      this._id = _id;
      this._externalId = externalId;
      this._name = name;
      this._email = email;
      this._thumbnailUrl = thumbnailUrl;
      this._lastAuthCode = lastAuthCode;
   }

   /**
   * set of 'getters' for private variables
   */
   get id(): string {
      return this._id;
   }
   get externalId(): string {
      return this._externalId;
   }
   get name(): string {
      return this._name;
   }
   get email(): string {
      return this._email;
   }
   get thumbnailUrl(): string {
      return this._thumbnailUrl;
   }
   get lastAuthCode(): string {
      return this._lastAuthCode;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
    equals (rhs: Person) : boolean {

      return ((this._id === rhs._id) &&
         (this._externalId === rhs._externalId) &&
         (this._name === rhs._name) &&
         (this._email === rhs._email) &&
         (this._thumbnailUrl === rhs._thumbnailUrl) &&
         (this._lastAuthCode === rhs._lastAuthCode));
   };

   /**
    * Method that serializes to JSON 
    */
   toJSON(): Object {

      return {
         __type: Person.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _id: this._id,
            _externalId: this._externalId,
            _name: this._name,
            _email: this._email,
            _thumbnailUrl: this._thumbnailUrl,
            _lastAuthCode: this._lastAuthCode
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revove from 
    */
   revive(data: any): Person {

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
   reviveDb(data: any) {

      return new Person (data._id,
         data._externalId,
         data._name,
         data._email,
         data._thumbnailUrl,
         data._lastAuthCode);
   };
};

