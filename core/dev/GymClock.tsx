/*! Copyright TXPCo, 2020, 2021 */
// GymClock spec is a 'templae' for a clock - how log, wether to play music, and which music. 
// GymClockAction is a way to send the start, pause, stop list via Rpc
// GymClockState is a class to represent the state of a running clock - is is started, stopped, paused etc, and if running, for how long. 
// GymClock is a running clock - created from a spec, then can start, stop, pause etc. 

import { IStreamableFor } from './Streamable';

export enum EGymClockDuration { 'Five', 'Ten', 'Fifteen', 'Twenty' };
export enum EGymClockMusic { 'Uptempo', 'Midtempo', 'None' };
export enum EGymClockState { 'Stopped', 'CountingDown', 'Running', 'Paused' };
export enum EGymClockAction { 'Start', 'Stop', 'Pause' };

const countDownSeconds: number = 15;

// Keep this function  declation up here in case an extra Enum is added above & this needs to change
function calculateCountToSeconds (durationEnum) {
   switch (durationEnum) {
      case EGymClockDuration.Five:
         return (countDownSeconds + 5 * 60);

      default:
      case EGymClockDuration.Ten:
         return (countDownSeconds + 10 * 60);

      case EGymClockDuration.Fifteen:
         return (countDownSeconds + 15 * 60);

      case EGymClockDuration.Twenty:
         return (countDownSeconds + 20 * 60);

   }
};

//==============================//
// GymClockSpec class
//==============================//
export class GymClockSpec implements IStreamableFor<GymClockSpec> {

   private _durationEnum: EGymClockDuration;
   private _musicEnum: EGymClockMusic;
   private _musicUrl: string;

   static readonly __type = "GymClockSpec";

  /**
   * Create a GymClockSpec object
   * @param durationEnum - one of the enumeration objects (10, 15, 20, ...)
   * @param musicEnum - one of the enumeration objects (Uptempo, Midtempo, none, ...)
   */
   constructor(durationEnum: EGymClockDuration = EGymClockDuration.Ten,
      musicEnum: EGymClockMusic = EGymClockMusic.None) {

      this._durationEnum = durationEnum;
      this._musicEnum = musicEnum;
      this._musicUrl = GymClockSpec.selectMusic(this._durationEnum, this._musicEnum);
   }

   /**
   * set of 'getters' for private variables
   */
   get durationEnum(): EGymClockDuration {
      return this._durationEnum;
   }
   get musicEnum(): EGymClockMusic {
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
   }

   static selectMusic(durationEnum: EGymClockDuration, musicEnum: EGymClockMusic): string {

      var url: string;

      if (musicEnum == EGymClockMusic.None) {
         return null;
      }
      else {
         if (musicEnum == EGymClockMusic.Uptempo) {
            switch (durationEnum) {
               case EGymClockDuration.Five:
                  return '130-bpm-workout-V2 trimmed.mp3';

               default:
               case EGymClockDuration.Ten:
                  return '10-Minute-Timer.mp3';

               case EGymClockDuration.Fifteen:
                  return '15-Minute-Timer.mp3';

               case EGymClockDuration.Twenty:
                  return '20-Minute-Timer.mp3';
            }
         }
         else {
            if (musicEnum == EGymClockMusic.Midtempo) {
               switch (durationEnum) {
                  case EGymClockDuration.Five:
                     return '130-bpm-workout-V2 trimmed.mp3';

                  default:
                  case EGymClockDuration.Ten:
                     return '130-bpm-workout-V2 trimmed.mp3';

                  case EGymClockDuration.Fifteen:
                     return '130-bpm-workout-V2 trimmed.mp3';

                  case EGymClockDuration.Twenty:
                     return '130-bpm-workout-V2 trimmed.mp3';
               }
            }
         }
      }
   };

   /**
   * Method that can deserialize JSON into an instance 
   * @param data - the JSON data to revive from 
   */
   static reviveDb(data: any): GymClockSpec {

     return new GymClockSpec(data._durationEnum, data._musicEnum);
   };
}


//==============================//
// GymClockAction class 
// Exists just to transport en enum of RPC with a type
//==============================//
export class GymClockAction implements IStreamableFor<GymClockAction> {

   private _actionEnum: EGymClockAction;

   static readonly __type = "GymClockAction";

   /**
    * Create a GymClockAction object
    */
   constructor(actionEnum: EGymClockAction) {

      this._actionEnum = actionEnum;
   }

   /**
   * set of 'getters' for private variables
   */
   get actionEnum(): EGymClockAction {
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
export class GymClockState implements IStreamableFor<GymClockState >  {

   _stateEnum: EGymClockState;
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
   get stateEnum(): EGymClockState {
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

