/*! Copyright TXPCo, 2020 */

import { IStreamable } from './Streamable';

//==============================//
// CallParticipation class
//==============================//
export class CallParticipation implements IStreamable<CallParticipation> {
   
   private _id: any;
   private _facilityId: string;
   private _personId: string;
   private _isCandidateLeader: boolean;
   private _sessionId: string;
   private _sessionSubId: string;
   private _glareResolve: number;

   static readonly __type = "CallParticipation";

   /**
    * Create a CallParticipation object
    * @param _id - Mongo-DB assigned ID
    * @param facilityId - ID for the facility hosting the call
    * @param personId - iD for the call participant 
    * @param isCandidateLeader - true of the person is a possible call leader
    * @param sessionId - iD for the call session (in case same person joins > once)
    * @param sessionSubId - iD for the call session (in case same person joins > once from same browser)
    * @param glareResolve - if provided, a number to use for the glareResolution test. By design, don't reset this 
    *    - same CallParticipation should keep the same glareResolve throughout its lifetime
    */
   constructor(_id: any=null,
      facilityId: string,
      personId: string,
      isCandidateLeader: boolean,
      sessionId: string,
      sessionSubId: string,
      glareResolve: number= Math.random()) {

      this._id = _id;
      this._facilityId = facilityId;
      this._personId = personId;
      this._isCandidateLeader = isCandidateLeader;
      this._sessionId = sessionId;
      this._sessionSubId = sessionSubId;
      if (glareResolve)
         this._glareResolve = glareResolve;
      else
         this._glareResolve = Math.random();
   }

   /**
   * set of 'getters' for private variables
   */
   get id(): any {
      return this._id;
   }
   get facilityId(): string {
      return this._facilityId;
   }
   get personId(): string {
      return this._personId;
   }
   get isCandidateLeader(): boolean {
      return this._isCandidateLeader;
   }
   get sessionId(): string {
      return this._sessionId;
   }
   get sessionSubId(): string {
      return this._sessionSubId;
   }
   get glareResolve(): number {
      return this._glareResolve;
   }
   get type(): string {
      return CallParticipation.__type;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: CallParticipation) : boolean{

      return ((this._id === rhs._id) &&
         (this._facilityId === rhs._facilityId) &&
         (this._personId === rhs._personId) &&
         (this._isCandidateLeader === rhs._isCandidateLeader) &&
         (this._sessionId === rhs._sessionId) && 
         (this._sessionSubId === rhs._sessionSubId) &&
         (this._glareResolve.toPrecision(10) === rhs._glareResolve.toPrecision(10)));
   };

   /**
    * Method that serializes to JSON 
    */
   toJSON(): Object {

      return {
         __type: CallParticipation.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _id: this._id,
            _facilityId: this._facilityId,
            _personId: this._personId,
            _isCandidateLeader: this._isCandidateLeader,
            _sessionId: this._sessionId,
            _sessionSubId: this._sessionSubId,
            _glareResolve: this._glareResolve
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revive from 
    */
   static revive (data: any): CallParticipation{

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return CallParticipation.reviveDb(data.attributes);

      return CallParticipation.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revive from 
   */
   static reviveDb(data: any): CallParticipation {

      return new CallParticipation (
         data._id,
         data._facilityId,
         data._personId,
         data._isCandidateLeader,
         data._sessionId,
         data._sessionSubId,
         data._glareResolve);
   };
}

//==============================//
// CallOffer class
//==============================//
export class CallOffer implements IStreamable<CallOffer>  {

   private _id: any;
   private _from: CallParticipation;
   private _to: CallParticipation;
   private _offer: any;

   static readonly __type = "CallOffer";

   /**
    * Create a CallOffer object
    * @param _id - Mongo-DB assigned ID
    * @param from - CallParticipation
    * @param to - CallParticipation
    * @param offer - the WebRTC Offer 
    */
   constructor(_id: any=null, from: CallParticipation, to: CallParticipation, offer: any) {

      this._id = _id;
      this._from = from;
      this._to = to;
      this._offer = offer;
   }

   /**
   * set of 'getters' for private variables
   */
   get id(): any {
      return this._id;
   }
   get from(): CallParticipation {
      return this._from;
   }
   get to(): CallParticipation {
      return this._to;
   }
   get offer(): any {
      return this._offer;
   }
   get type(): string {
      return CallOffer.__type;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: CallOffer): boolean {

      return ((this._id === rhs._id) &&
         (this._from.equals(rhs._from)) &&
         (this._to.equals(rhs._to)) &&
         (this._offer === rhs._offer));
   };

   /**
    * Method that serializes to JSON 
    */
   toJSON(): Object {

      return {
         __type: CallOffer.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _id: this._id,
            _from: this._from,
            _to: this._to,
            _offer: this._offer
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revive from 
    */
   static revive(data: any): CallOffer {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return CallOffer.reviveDb(data.attributes);

      return CallOffer.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revive from 
   */
   static reviveDb(data: any): CallOffer {

      return new CallOffer(data._id,
         CallParticipation.revive(data._from),
         CallParticipation.revive(data._to),
         data._offer);
   };
}

//==============================//
// CallAnswer class
//==============================//
export class CallAnswer implements IStreamable<CallAnswer> {

   private _id: any;
   private _from: CallParticipation;
   private _to: CallParticipation;
   private _answer: any;

   static readonly __type = "CallAnswer";

   /**
    * Create a CallOffer object
    * @param _id - Mongo-DB assigned ID
    * @param from - CallParticipation
    * @param to - CallParticipation
    * @param answer - the WebRTC Offer 
    */
   constructor(_id: any=null, from: CallParticipation, to: CallParticipation, answer: any) {

      this._id = _id;
      this._from = from;
      this._to = to;
      this._answer = answer;
   }

   /**
   * set of 'getters' for private variables
   */
   get id(): any {
      return this._id;
   }
   get from(): CallParticipation {
      return this._from;
   }
   get to(): CallParticipation {
      return this._to;
   }
   get answer(): any {
      return this._answer;
   }
   get type(): string {
      return CallAnswer.__type;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: CallAnswer): boolean {

      return ((this._id === rhs._id) &&
         (this._from.equals(rhs._from)) &&
         (this._to.equals(rhs._to)) &&
         (this._answer === rhs._answer));
   };

   /**
    * Method that serializes to JSON 
    */
   toJSON(): Object {

      return {
         __type: CallAnswer.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _id: this._id,
            _from: this._from,
            _to: this._to,
            _answer: this._answer
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revive from 
    */
   static revive(data: any): CallAnswer {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return CallAnswer.reviveDb(data.attributes);

      return CallAnswer.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revive from 
   */
   static reviveDb(data: any): CallAnswer {

      return new CallAnswer(data._id,
         CallParticipation.revive(data._from),
         CallParticipation.revive(data._to),
         data._answer);
   };
}

//==============================//
// CallIceCandidate class
//==============================//
export class CallIceCandidate implements IStreamable<CallIceCandidate>  {

   private _id: any;
   private _from: CallParticipation;
   private _to: CallParticipation;
   private _ice: any;
   private _outbound: boolean;

   static readonly __type = "CallIceCandidate";

   /**
    * Create a CallIceCandidate object
    * @param _id - Mongo-DB assigned ID
    * @param from - CallParticipation
    * @param to - CallParticipation
    * @param ice - the WebRTC ice, may be null
    * @param outbound - TRUE if this is from an outbound (Offer) connection
    */
   constructor(_id: any = null, from: CallParticipation, to: CallParticipation, ice: any, outbound: boolean) {

      this._id = _id;
      this._from = from;
      this._to = to;
      this._ice = ice;
      this._outbound = outbound;
   }

   /**
   * set of 'getters' for private variables
   */
   get id(): any {
      return this._id;
   }
   get from(): CallParticipation {
      return this._from;
   }
   get to(): CallParticipation {
      return this._to;
   }
   get ice(): any {
      return this._ice;
   }
   get outbound(): boolean {
      return this._outbound;
   }   
   get type(): string {
      return CallIceCandidate.__type;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: CallIceCandidate): boolean {

      return ((this._id === rhs._id) &&
         (this._from.equals(rhs._from)) &&
         (this._to.equals(rhs._to)) &&
         (this._ice === rhs._ice) &&
         (this._outbound === rhs._outbound));
   };

   /**
    * Method that serializes to JSON 
    */
   toJSON () : any {

      return {
         __type: CallIceCandidate.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _id: this._id,
            _from: this._from,
            _to: this._to,
            _ice: this._ice,
            _outbound: this._outbound
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revive from 
    */
   static revive(data: any): CallIceCandidate {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return CallIceCandidate.reviveDb(data.attributes);

      return CallIceCandidate.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revive from 
   */
   static reviveDb(data: any): CallIceCandidate {

      return new CallIceCandidate(data._id,
         CallParticipation.revive(data._from),
         CallParticipation.revive(data._to),
         data._ice,
         data._outbound); 
   };
}

//==============================//
// CallLeaderResolve class - used to resolve who is the call leader. 
// Send random numbers to each other, highest wins. 
//==============================//
export class CallLeaderResolve implements IStreamable<CallLeaderResolve>  {

   private _id: any; 
   private _glareDate: Date; 
   private _glareResolve: number; 

   static readonly __type = "CallLeaderResolve";

   /**
    * Create a CallLeaderResolve object
    * @param glareDate - if provided, date the call leader logged in. By design, don't reset this
    *    - same CallParticipation should keep the same glareDate throughout its lifetime
    * @param glareResolve - if provided, a number to use for the glareResolution test. By design, don't reset this
    *    - same CallParticipation should keep the same glareResolve throughout its lifetime
    */
   constructor (_id: any=null,
      glareDate: Date = new Date(), glareResolve: number = Math.random()) {

      this._id = _id;
      this._glareDate = glareDate;
      this._glareResolve = glareResolve;
   }

   /**
   * set of 'getters' for private variables
   */
   get id(): string {
      return this._id;
   }
   get type(): string {
      return CallLeaderResolve.__type;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: CallLeaderResolve) : boolean {

      return ((this._id === rhs._id) &&
         this._glareDate.getTime() === rhs._glareDate.getTime() &&
         this._glareResolve.toPrecision(10) === rhs._glareResolve.toPrecision(10));
   };

   
   /**
    * test to see if this object wins the resolution
    * @param rhs - the object to compare this one to.  
    */
   isWinnerVs(rhs: CallLeaderResolve): boolean {

      // Use the date first - this means first person logged in is usually the winner
      // else use the random value to do a lottery, lowest wins so directionality is the same
      return ((this._glareDate.getTime() < rhs._glareDate.getTime()) || 
         ((this._glareDate.getTime() === rhs._glareDate.getTime()) && (this._glareResolve < rhs._glareResolve)));
   };

   /**
    * Method that serializes to JSON 
    */
   toJSON () : any {

      return {
         __type: CallLeaderResolve.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _id: this._id,
            _glareDate: this._glareDate,
            _glareResolve: this._glareResolve
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revive from 
    */
   static revive(data: any): CallLeaderResolve {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return CallLeaderResolve.reviveDb(data.attributes);

      return CallLeaderResolve.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revive from 
   */
   static reviveDb(data: any): CallLeaderResolve {

      return new CallLeaderResolve(data._id, new Date(data._glareDate), Number (data._glareResolve));
   };
}

//==============================//
// CallKeepAlive class
//==============================//
export class CallKeepAlive implements IStreamable<CallKeepAlive> {
   private _id: string;

   static readonly __type = "CallKeepAlive";

   /**
    * Create a CallKeepAlive object
    */
   constructor (_id: string) {

      this._id = _id;
   }

   get type(): string {
      return CallKeepAlive.__type;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: CallKeepAlive) : boolean {

      return ((this._id === rhs._id));
   };

   /**
    * Method that serializes to JSON 
    */
   toJSON () : any {

      return {
         __type: CallKeepAlive.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _id: this._id,
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revive from 
    */
   static revive(data: any): CallKeepAlive {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return CallKeepAlive.reviveDb(data.attributes);

      return CallKeepAlive.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revive from 
   */
   static reviveDb(data: any): CallKeepAlive {

      return new CallKeepAlive(data._id);
   };
}
