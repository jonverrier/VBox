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
   private _meetingId : string;
   private _sessionSubId: string;
   private _sequenceNo: number;
   private _data: any;

   static readonly __type = "SignalMessage";

  /**
   * Create a SignalMessage object 
   * @param _id - Mongo-DB assigned ID
   * @param meetingId - ID for the meetingl*
   * @param sessionSubId - iD for the call session (in case same person joins > once from same browser)
   * @param sequenceNo - message sequence number, climbs nomintonicaly up from 0
   * @param data - data as an object. This is transformed to and from JSON for transport, must be registered with Type infrastructure
   */
   constructor(_id, _meetingId, sessionSubId, sequenceNo, data) {

      this._id = _id;
      this._meetingId = _meetingId;
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
   get meetingId(): string {
      return this._meetingId;
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
         (this._meetingId === rhs._meetingId) &&
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
            _meetingId: this._meetingId,
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
                               data._meetingId,
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
         signalMessageIn._meetingId,
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
         signalMessageIn._meetingId,
         signalMessageIn._sessionSubId,
         signalMessageIn._sequenceNo,
         types.reviveFromJSON(signalMessageIn._data));
   }
}
