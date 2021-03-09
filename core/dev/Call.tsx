/*! Copyright TXPCo, 2020, 2021 */

import { IStreamableFor } from './Streamable';
import { StreamableTypes } from './StreamableTypes';

export enum ETransportType {
   Rtc,
   Web
}

//==============================//
// CallParticipation class
//==============================//
export class CallParticipation implements IStreamableFor<CallParticipation> {
   
   private _meetingId: string;
   private _isCandidateLeader: boolean;
   private _sessionSubId: string;
   private _glareResolve: number;

   static readonly __type = "CallParticipation";

   /**
    * Create a CallParticipation object
    * @param meetingId - ID for the facility hosting the call
    * @param isCandidateLeader - true if the person is a possible call leader
    * @param sessionSubId - iD for the call session (in case same person joins > once from same browser)
    * @param glareResolve - if provided, a number to use for the glareResolution test. By design, don't reset this 
    *    - same CallParticipation should keep the same glareResolve throughout its lifetime
    */
   constructor (
      meetingId: string,
      sessionSubId: string,
      isCandidateLeader: boolean,
      glareResolve: number= Math.random()) {

      this._meetingId = meetingId;
      this._isCandidateLeader = isCandidateLeader;
      this._sessionSubId = sessionSubId;
      if (glareResolve)
         this._glareResolve = glareResolve;
      else
         this._glareResolve = Math.random();
   }

   /**
   * set of 'getters' for private variables
   */
   get meetingId(): string {
      return this._meetingId;
   }
   get isCandidateLeader(): boolean {
      return this._isCandidateLeader;
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

      return ((this._meetingId === rhs._meetingId) &&
         (this._sessionSubId === rhs._sessionSubId) &&
         (this._isCandidateLeader === rhs._isCandidateLeader) &&
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
            _meetingId: this._meetingId,
            _sessionSubId: this._sessionSubId,
            _isCandidateLeader: this._isCandidateLeader,
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
         data._meetingId,
         data._sessionSubId,
         data._isCandidateLeader,
         data._glareResolve);
   };
}

//==============================//
// CallOffer class
//==============================//
export class CallOffer implements IStreamableFor<CallOffer>  {

   private _from: CallParticipation;
   private _to: CallParticipation;
   private _offer: any;
   private _transport: ETransportType;

   static readonly __type = "CallOffer";

   /**
    * Create a CallOffer object
    * @param from - CallParticipation
    * @param to - CallParticipation
    * @param offer - the WebRTC Offer 
    * @param transport = transport type (Web or RTC)
    */
   constructor(from: CallParticipation, to: CallParticipation, offer: any, transport: ETransportType) {

      this._from = from;
      this._to = to;
      this._offer = offer;
      this._transport = transport;
   }

   /**
   * set of 'getters' for private variables
   */
   get from(): CallParticipation {
      return this._from;
   }
   get to(): CallParticipation {
      return this._to;
   }
   get offer(): any {
      return this._offer;
   }
   get transport(): ETransportType {
      return this._transport;
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

      return ((this._from.equals(rhs._from)) &&
         (this._to.equals(rhs._to)) &&
         (this._offer === rhs._offer) &&
         (this._transport === rhs._transport));
   };

   /**
    * Method that serializes to JSON 
    */
   toJSON(): Object {

      return {
         __type: CallOffer.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _from: this._from,
            _to: this._to,
            _offer: this._offer,
            _transport: this.transport
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

      return new CallOffer(
         CallParticipation.revive(data._from),
         CallParticipation.revive(data._to),
         data._offer,
         data._transport);
   };
}

//==============================//
// CallAnswer class
//==============================//
export class CallAnswer implements IStreamableFor<CallAnswer> {

   private _from: CallParticipation;
   private _to: CallParticipation;
   private _answer: any;
   private _transport: ETransportType;

   static readonly __type = "CallAnswer";

   /**
    * Create a CallAnswer object
    * @param from - CallParticipation
    * @param to - CallParticipation
    * @param answer - the WebRTC Offer 
    * @param transport = transport type (Web or RTC)
    */
   constructor(from: CallParticipation, to: CallParticipation, answer: any, transport: ETransportType) {

      this._from = from;
      this._to = to;
      this._answer = answer;
      this._transport = transport;
   }

   /**
   * set of 'getters' for private variables
   */
   get from(): CallParticipation {
      return this._from;
   }
   get to(): CallParticipation {
      return this._to;
   }
   get answer(): any {
      return this._answer;
   }
   get transport(): ETransportType {
      return this._transport;
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

      return ((this._from.equals(rhs._from)) &&
         (this._to.equals(rhs._to)) &&
         (this._answer === rhs._answer) &&
         (this._transport === rhs._transport));
   };

   /**
    * Method that serializes to JSON 
    */
   toJSON(): Object {

      return {
         __type: CallAnswer.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _from: this._from,
            _to: this._to,
            _answer: this._answer,
            _transport: this._transport
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

      return new CallAnswer(
         CallParticipation.revive(data._from),
         CallParticipation.revive(data._to),
         data._answer,
         data._transport);
   };
}

//==============================//
// CallIceCandidate class
//==============================//
export class CallIceCandidate implements IStreamableFor<CallIceCandidate>  {

   private _from: CallParticipation;
   private _to: CallParticipation;
   private _ice: any;
   private _outbound: boolean;

   static readonly __type = "CallIceCandidate";

   /**
    * Create a CallIceCandidate object
    * @param from - CallParticipation
    * @param to - CallParticipation
    * @param ice - the WebRTC ice, may be null
    * @param outbound - TRUE if this is from an outbound (Offer) connection
    */
   constructor(from: CallParticipation, to: CallParticipation, ice: any, outbound: boolean) {

      this._from = from;
      this._to = to;
      this._ice = ice;
      this._outbound = outbound;
   }

   /**
   * set of 'getters' for private variables
   */
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

      return ((this._from.equals(rhs._from)) &&
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

      return new CallIceCandidate(
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
export class CallLeaderResolve implements IStreamableFor<CallLeaderResolve>  {

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
   constructor (glareDate: Date = new Date(), glareResolve: number = Math.random()) {

      this._glareDate = glareDate;
      this._glareResolve = glareResolve;
   }

   /**
   * set of 'getters' for private variables
   */
   get type(): string {
      return CallLeaderResolve.__type;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: CallLeaderResolve) : boolean {

      return (this._glareDate.getTime() === rhs._glareDate.getTime() &&
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

      return new CallLeaderResolve(new Date(data._glareDate), Number (data._glareResolve));
   };
}

//==============================//
// CallKeepAlive class
//==============================//
export class CallKeepAlive implements IStreamableFor<CallKeepAlive> {
   private _sequenceNo: number;

   static readonly __type = "CallKeepAlive";

   /**
    * Create a CallKeepAlive object
    */
   constructor(sequenceNo: number=0) {

      this._sequenceNo = sequenceNo;
   }

   /**
   * set of 'getters' for private variables
   */
   get sequenceNo(): number {
      return this._sequenceNo;
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

      return ((this._sequenceNo === rhs._sequenceNo));
   };

   /**
    * Method that serializes to JSON 
    */
   toJSON () : any {

      return {
         __type: CallKeepAlive.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _sequenceNo: this._sequenceNo,
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

      return new CallKeepAlive(data._sequenceNo);
   };
}

//==============================//
// CallData class
//==============================//
export class CallData implements IStreamableFor<CallData> {

   private _from: CallParticipation;
   private _to: CallParticipation;
   private _data: any;

   static readonly __type = "CallData";

   /**
    * Create a CallData object - used when webRTC fails & data is shipped via server
    * @param from - CallParticipation
    * @param to - CallParticipation
    * @param data - the data payload 
    */
   constructor(from: CallParticipation, to: CallParticipation, data: any) {

      this._from = from;
      this._to = to;
      this._data = data;
   }

   /**
   * set of 'getters' for private variables
   */
   get from(): CallParticipation {
      return this._from;
   }
   get to(): CallParticipation {
      return this._to;
   }
   get data(): any {
      return this._data;
   }
   get type(): string {
      return CallData.__type;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: CallData): boolean {

      return ((this._from.equals(rhs._from)) &&
         (this._to.equals(rhs._to)) &&
         (this._data === rhs._data));
   };

   /**
    * Method that serializes to JSON 
    */
   toJSON(): Object {

      return {
         __type: CallData.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _from: this._from,
            _to: this._to,
            _data: JSON.stringify(this._data)
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revive from 
    */
   static revive(data: any): CallData {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return CallData.reviveDb(data.attributes);

      return CallData.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revive from 
   */
   static reviveDb(data: any): CallData {

      var types = new StreamableTypes();

      return new CallData(
         CallParticipation.revive(data._from),
         CallParticipation.revive(data._to),
         types.reviveFromJSON(data._data));
   };
}

//==============================//
// CallDataBatched class
//==============================//
export class CallDataBatched implements IStreamableFor<CallDataBatched> {

   private _from: CallParticipation;
   private _to: Array<CallParticipation>;
   private _data: any;

   static readonly __type = "CallDataBatched";

   /**
    * Create a CallDataBatched object - used when webRTC fails & data is shipped via server
    * This class is used when data is to be delivered to possibly multiple participants
    * @param from - CallParticipation
    * @param to - CallParticipation - for this version, its an array.
    * @param data - the data payload 
    */
   constructor(from: CallParticipation, to: Array<CallParticipation>, data: any) {

      this._from = from;
      this._to = to;
      this._data = data;
   }

   /**
   * set of 'getters' for private variables
   */
   get from(): CallParticipation {
      return this._from;
   }
   get to(): Array<CallParticipation> {
      return this._to;
   }
   get data(): any {
      return this._data;
   }
   get type(): string {
      return CallData.__type;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: CallDataBatched): boolean {

      return ((this._from.equals(rhs._from)) &&
         ((this._to as any).equals(rhs._to)) && // Uses the equals method from ArrayHook
         this.data === rhs.data); 
   };

   /**
    * Method that serializes to JSON 
    */
   toJSON(): Object {

      return {
         __type: CallDataBatched.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _from: this._from,
            _to: this._to,
            _data: JSON.stringify(this._data)
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revive from 
    */
   static revive(data: any): CallDataBatched {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return CallDataBatched.reviveDb(data.attributes);

      return CallDataBatched.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revive from 
   */
   static reviveDb(data: any): CallDataBatched {

      // revive the list of targets
      let revivedParticipations = new Array<CallParticipation>(data._to ? data._to.length: 0);
      for (var i = 0; data._to && i < data._to.length; i++) {
         revivedParticipations[i] = CallParticipation.revive(data._to[i]);
      }

      var types = new StreamableTypes();

      return new CallDataBatched(
         CallParticipation.revive(data._from),
         revivedParticipations,
         types.reviveFromJSON(data._data));
   };
}