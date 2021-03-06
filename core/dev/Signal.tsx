/*jslint white: false, indent: 3, maxerr: 1000 */
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2020, 2021 */

import { CallParticipation, CallOffer, CallAnswer, CallIceCandidate, CallLeaderResolve, CallKeepAlive , CallData} from './Call';
import { StreamableTypes } from './StreamableTypes';
import { IStreamableFor } from './Streamable';

//==============================//
// SignalMessage class
//==============================//
export class SignalMessage implements IStreamableFor<SignalMessage>  {

   private _id: any;
   private _facilityId : string;
   private _sessionId: string;
   private _sessionSubId: string;
   private _sequenceNo: number;
   private _data: any;

   static readonly __type = "SignalMessage";

  /**
   * Create a SignalMessage object 
   * @param _id - Mongo-DB assigned ID
   * @param facilityId - ID for the facility hosting the call*
   * @param sessionId - iD for the call session (in case same person joins > once)
   * @param sessionSubId - iD for the call session (in case same person joins > once from same browser)
   * @param sequenceNo - message sequence number, climbs nomintonicaly up from 0
   * @param data - data as an object. This is transformed to and from JSON for transport, must be registered with Type infrastructure
   */
   constructor (_id, facilityId, sessionId, sessionSubId, sequenceNo, data) {

      this._id = _id;
      this._facilityId = facilityId;
      this._sessionId = sessionId;
      this._sessionSubId = sessionSubId;
      this._sequenceNo = sequenceNo;
      this._data = data;
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
   get sessionId(): string {
      return this._sessionId;
   }
   get sessionSubId(): string {
      return this._sessionSubId;
   }
   get sequenceNo(): number {
      return this._sequenceNo;
   }
   get data(): any {
      return this._data;
   }
   get type(): string {
      return SignalMessage.__type;
   }

  /**
   * test for equality - checks all fields are the same. 
   * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
   * @param rhs - the object to compare this one to.  
   */
   equals(rhs: SignalMessage) : boolean {

      return (this._id === rhs._id &&
         (this._facilityId === rhs._facilityId) &&
         (this._sessionId === rhs._sessionId) &&
         (this._sessionSubId === rhs._sessionSubId) &&
         (this._sequenceNo === rhs._sequenceNo) &&
         this._data.equals (rhs._data)); 
   };

   /**
    * Method that serializes to JSON 
    */
   toJSON () : any {

      return {
         __type: SignalMessage.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _id: this._id,
            _facilityId: this._facilityId,
            _sessionId: this._sessionId,
            _sessionSubId: this._sessionSubId,
            _sequenceNo: this._sequenceNo,
            _data: JSON.stringify (this._data)
         }
      };
   };

  /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   static revive(data: any): SignalMessage {
      
      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return SignalMessage.reviveDb(data.attributes);
      else
         return SignalMessage.reviveDb(data);
   };
   
   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revove from 
   */
   static reviveDb(data: any): SignalMessage {

      var types = new StreamableTypes();

      return new SignalMessage(data._id,
                               data._facilityId,
                               data._sessionId,
                               data._sessionSubId,
                               data._sequenceNo,
                               types.reviveFromJSON(data._data));
   };

   /**
    * Used to change the payload to JSON before storage
    * @param signalMessageIn - the object to transform
    */
   static toStored(signalMessageIn: SignalMessage): SignalMessage {
      return new SignalMessage(signalMessageIn._id,
         signalMessageIn._facilityId,
         signalMessageIn._sessionId,
         signalMessageIn._sessionSubId,
         signalMessageIn._sequenceNo,
         JSON.stringify(signalMessageIn._data));
   }

   /**
    * Used to change the payload to JSON after storage
    * @param signalMessageIn - the object to transform
    */
   static fromStored(signalMessageIn: SignalMessage): SignalMessage {
      var types = new StreamableTypes();

      return new SignalMessage(signalMessageIn._id,
         signalMessageIn._facilityId,
         signalMessageIn._sessionId,
         signalMessageIn._sessionSubId,
         signalMessageIn._sequenceNo,
         types.reviveFromJSON(signalMessageIn._data));
   }
}
