
/*! Copyright TXPCo, 2020, 2021 */
import { Person } from './Person';
import { Facility } from './Facility';
import { CallParticipation, CallOffer, CallAnswer, CallIceCandidate, CallLeaderResolve, CallKeepAlive, CallData, CallDataBatched } from './Call'
import { SignalMessage } from './Signal';
import { UserFacilities } from './UserFacilities';
import { GymClockSpec, GymClockAction, GymClockState } from './GymClock';
import { LiveWorkout, LiveWhiteboardCommand, LiveResultsCommand, LiveClockSpecCommand } from './LiveWorkout';
import { LiveUndoCommand } from './LiveCommand';

//==============================//
// StreamableTypes class
//==============================//
export class StreamableTypes {

   private _types: any;

   /**
    * Creates a StreamableTypes for use in streaming objects to and from JSON
    */
   constructor() {

      // Registry of types
      this._types = {};
      this._types.Person = Person;
      this._types.Facility = Facility;
      this._types.CallParticipation = CallParticipation;
      this._types.CallOffer = CallOffer,
      this._types.CallAnswer = CallAnswer;
      this._types.CallIceCandidate = CallIceCandidate;
      this._types.CallLeaderResolve = CallLeaderResolve;
      this._types.CallKeepAlive = CallKeepAlive;
      this._types.CallData = CallData;
      this._types.CallDataBatched = CallDataBatched;
      this._types.SignalMessage = SignalMessage;
      this._types.UserFacilities = UserFacilities;
      this._types.GymClockSpec = GymClockSpec;
      this._types.GymClockAction = GymClockAction;
      this._types.GymClockState = GymClockState;
      this._types.LiveWorkout = LiveWorkout;
      this._types.LiveWhiteboardCommand = LiveWhiteboardCommand;
      this._types.LiveResultsCommand = LiveResultsCommand;
      this._types.LiveClockSpecCommand = LiveClockSpecCommand;
      this._types.LiveUndoCommand = LiveUndoCommand;

   }

   isObjectKey(key: string): boolean {
      let keyNum = Number(key);
      return key === '' || (!isNaN(keyNum - 0));
   };

   /**
     * Looks up a type name in JSON and returns a constructed object if there is a match
     * @param jsonString - the test to parse for a class 
     */
   reviveFromJSON(jsonString: string) : any {

      var registry = this;

      return JSON.parse(jsonString, function (key, value) {
         if (registry.isObjectKey(key) && value.hasOwnProperty('__type'))
            return registry._types[value.__type].revive(value);
         else
            return this[key];
      });
   };
}



