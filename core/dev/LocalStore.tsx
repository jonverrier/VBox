/*! Copyright TXPCo, 2020, 2021 */

//==============================//
// LocalStore class
//==============================//
export class LocalStore {  

   /**
    * Initialises repository 
    */
   constructor() {
   }

   /**
    *
    * saveValue
    * @param key - key to use to look up data
    * @param value - value to save 
    */
   saveValue (key: string, value: string) {
      if (typeof window !== 'undefined' && window.localStorage)
         window.localStorage.setItem(key, value.toString());
   };
   
   /**
    *
    * loadValue 
    * @param key - key to use to look up data 
    */
   loadValue(key: string) {
      if (typeof window !== 'undefined' && window.localStorage)
         return window.localStorage.getItem(key);
      else
         return null;
   };
   
   /**
    *
    * clearValue 
    * @param key - key to use to look up data 
    */
   clearValue (key: string) {
      if (typeof window !== 'undefined' && window.localStorage)
         window.localStorage.removeItem(key);
   }
}

const lastMeetingId = "lastMeetingId";
const lastNameId = "lastName";
const lastWorkoutId = "lastWorkout";
const lastClockId = "lastClock";
const lastClockStateId = "lastClockState";

//==============================//
// StoredMeetingState class
//==============================//
export class StoredMeetingState {

   private _store: LocalStore;

   constructor() {
      this._store = new LocalStore();
   }

   /**
    *
    * saveMeetingId
    * @param meetingId - value to save
    */
   saveMeetingId(meetingId: string) {
      this._store.saveValue(lastMeetingId, meetingId);
   };

   /**
    *
    * loadMeetingId
    */
   loadMeetingId() : string {
      var ret = this._store.loadValue(lastMeetingId);
      if (!ret)
         ret = "";
      return ret;
   };

   /**
    *
    * saveName
    * @param meetingId - value to save
    */
   saveName(meetingId: string) {
      this._store.saveValue(lastNameId, meetingId);
   };

   /**
    *
    * loadName
    */
   loadName(): string {
      var ret = this._store.loadValue(lastNameId);
      if (!ret)
         ret = "";
      return ret;
   };
}

//==============================//
// StoredWorkoutState class
//==============================//
export class StoredWorkoutState {

   private _store: LocalStore;

   constructor() {
      this._store = new LocalStore();
   }

   /**
    *
    * saveWorkout
    * @param workout - value to save
    */
   saveWorkout(workout: string) {
      this._store.saveValue(lastWorkoutId, workout);
   };

   /**
    *
    * loadWorkout
    */
   loadWorkout(): string {
      var ret = this._store.loadValue(lastWorkoutId);
      if (!ret)
         ret = "";
      return ret;
   };

   /**
    *
    * saveClockSpec
    * @param clock - value to save
    */
   saveClockSpec(clock: string) {
      this._store.saveValue(lastClockId, clock);
   };

   /**
    *
    * loadClockSpec
    */
   loadClockSpec(): string {
      var ret = this._store.loadValue(lastClockId);
      if (!ret)
         ret = "";
      return ret;
   };

   /**
    *
    * saveClockState
    * @param clock - value to save
    */
   saveClockState(clock: string) {
      this._store.saveValue(lastClockStateId, clock);
   };

   /**
    *
    * loadClockState
    */
   loadClockState(): string {
      var ret = this._store.loadValue(lastClockStateId);
      if (!ret)
         ret = "";
      return ret;
   };
}