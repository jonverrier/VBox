/*! Copyright TXPCo, 2020, 2021 */
// GymClock spec is a 'templae' for a clock - how log, wether to play music, and which music. 
// GymClockAction is a way to send the start, pause, stop list via Rpc
// GymClockState is a class to represent the state of a running clock - is is started, stopped, paused etc, and if running, for how long. 
// GymClock is a running clock - created from a spec, then can start, stop, pause etc. 

import { IStreamable } from './Streamable';

export enum GymClockDurationEnum { 'Five', 'Ten', 'Fifteen', 'Twenty' };
export enum GymClockMusicEnum { 'Uptempo', 'Midtempo', 'None' };
export enum GymClockStateEnum { 'Stopped', 'CountingDown', 'Running', 'Paused' };
export enum GymClockActionEnum { 'Start', 'Stop', 'Pause' };

const countDownSeconds: number = 15;

// Keep this function  declation up here in case an extra Enum is added above & this needs to change
function calculateCountToSeconds (durationEnum) {
   switch (durationEnum) {
      case GymClockDurationEnum.Five:
         return (countDownSeconds + 5 * 60);

      default:
      case GymClockDurationEnum.Ten:
         return (countDownSeconds + 10 * 60);

      case GymClockDurationEnum.Fifteen:
         return (countDownSeconds + 15 * 60);

      case GymClockDurationEnum.Twenty:
         return (countDownSeconds + 20 * 60);

   }
};

//==============================//
// GymClockSpec class
//==============================//
export class GymClockSpec implements IStreamable<GymClockSpec> {

   private _durationEnum: GymClockDurationEnum;
   private _musicEnum: GymClockMusicEnum;
   private _musicUrl: string;

   static readonly __type = "GymClockSpec";

  /**
   * Create a GymClockSpec object
   * @param durationEnum - one of the enumeration objects (10, 15, 20, ...)
   * @param musicEnum - one of the enumeration objects (Uptempo, Midtempo, none, ...)
   * @param musicUrl - string URL to the music file. Can be null.
   */
   constructor(durationEnum: GymClockDurationEnum = GymClockDurationEnum.Ten,
      musicEnum: GymClockMusicEnum = GymClockMusicEnum.None,
      musicUrl: string = '') {

      this._durationEnum = durationEnum;
      this._musicEnum = musicEnum;
      this._musicUrl = musicUrl;
   }

   /**
   * set of 'getters' for private variables
   */
   get durationEnum(): GymClockDurationEnum {
      return this._durationEnum;
   }
   get musicEnum(): GymClockMusicEnum {
      return this._musicEnum;
   }
   get musicUrl(): string {
      return this._musicUrl;
   }
   get type(): string {
      return GymClockSpec.__type;
   }

  /**
   * test for equality - checks all fields are the same. 
   * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
   * @param rhs - the object to compare this one to.  
   */
   equals (rhs: GymClockSpec) : boolean {

      return (this._durationEnum === rhs._durationEnum
         && this._musicEnum === rhs._musicEnum
         && this._musicUrl === rhs._musicUrl);
   };

   /**
 * Method that serializes to JSON 
 */
   toJSON () : any {

      return {
         __type: GymClockSpec.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _durationEnum: this._durationEnum,
            _musicEnum: this._musicEnum,
            _musicUrl: this._musicUrl
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revive from 
    */
   static revive(data: any): GymClockSpec {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return GymClockSpec.reviveDb(data.attributes);

      return GymClockSpec.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revive from 
   */
   static reviveDb(data: any): GymClockSpec {

     return new GymClockSpec(data._durationEnum, data._musicEnum, data._musicUrl);
   };
}


//==============================//
// GymClockAction class 
// Exists just to transport en enum of RPC with a type
//==============================//
export class GymClockAction implements IStreamable<GymClockAction> {

   private _actionEnum: GymClockActionEnum;

   static readonly __type = "GymClockAction";

   /**
    * Create a GymClockAction object
    */
   constructor(actionEnum: GymClockActionEnum) {

      this._actionEnum = actionEnum;
   }

   /**
   * set of 'getters' for private variables
   */
   get actionEnum(): GymClockActionEnum {
      return this._actionEnum;
   }
   get type(): string {
      return GymClockAction.__type;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: GymClockAction) : boolean {

      return (this._actionEnum === rhs._actionEnum);
   };


   /**
    * Method that serializes to JSON 
    */
   toJSON () : any {

      return {
         __type: GymClockAction.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _actionEnum: this._actionEnum
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revive from 
    */
   static revive(data: any): GymClockAction {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return GymClockAction.reviveDb(data.attributes);

      return GymClockAction.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revive from 
   */
   static reviveDb(data: any): GymClockAction{

      return new GymClockAction(data._actionEnum);
   };
}

//==============================//
// GymClockState class 
//==============================//
export class GymClockState implements IStreamable<GymClockState >  {

   _stateEnum: GymClockStateEnum;
   _secondsIn: number;

   static readonly __type = "GymClockState";

   /**
    * Create a GymClockState object
    */
   constructor (stateEnum, secondsIn) {

      this._stateEnum = stateEnum;
      this._secondsIn = secondsIn;
   }   


   /**
   * set of 'getters' for private variables
   */
   get stateEnum(): GymClockStateEnum {
      return this._stateEnum;
   }
   get secondsIn(): number {
      return this._secondsIn;
   }
   get type(): string {
      return GymClockState.__type;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: GymClockState): boolean {

      return (this._stateEnum === rhs._stateEnum &&
         this._secondsIn === rhs._secondsIn);
   };


   /**
    * Method that serializes to JSON 
    */
   toJSON () : any {

      return {
         __type: GymClockState.__type,
         // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
         attributes: {
            _stateEnum: this._stateEnum,
            _secondsIn: this._secondsIn
         }
      };
   };

   /**
    * Method that can deserialize JSON into an instance 
    * @param data - the JSON data to revive from 
    */
   static revive(data: any): GymClockState {

      // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
      if (data.attributes)
         return GymClockState.reviveDb(data.attributes);

      return GymClockState.reviveDb(data);
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revive from 
   */
   static reviveDb(data: any): GymClockState {

      return new GymClockState(data._stateEnum, data._secondsIn);
   };
}

