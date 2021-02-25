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
      if (window.localStorage)
         window.localStorage.setItem(key, value.toString());
   };
   
   /**
    *
    * loadValue 
    * @param key - key to use to look up data 
    */
   loadValue(key: string) {
      if (window.localStorage)
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
      if (window.localStorage)
         window.localStorage.removeItem(key);
   }
}

const lastMeetingId = "lastMeetingId";
const lastNameId = "lastName";
const lastWorkoutId = "lastWorkout";
const lastClockId = "lastClock";
const lastClockStateId = "lastClockState";

//==============================//
// MeetingScreenState class
//==============================//
export class MeetingScreenState {

   store: LocalStore;

   constructor() {
      this.store = new LocalStore();
   }

   /**
    *
    * saveMeetingId
    * @param meetingId - value to save
    */
   saveMeetingId(meetingId: string) {
      this.store.saveValue(lastMeetingId, meetingId);
   };

   /**
    *
    * loadMeetingId
    */
   loadMeetingId() : string {
      var ret = this.store.loadValue(lastMeetingId);
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
      this.store.saveValue(lastNameId, meetingId);
   };

   /**
    *
    * loadName
    */
   loadName(): string {
      var ret = this.store.loadValue(lastNameId);
      if (!ret)
         ret = "";
      return ret;
   };
}

//==============================//
// MeetingWorkoutState class
//==============================//
export class MeetingWorkoutState {

   store: LocalStore;

   constructor() {
      this.store = new LocalStore();
   }

   /**
    *
    * saveWorkout
    * @param workout - value to save
    */
   saveWorkout(workout: string) {
      this.store.saveValue(lastWorkoutId, workout);
   };

   /**
    *
    * loadWorkout
    */
   loadWorkout(): string {
      var ret = this.store.loadValue(lastWorkoutId);
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
      this.store.saveValue(lastClockId, clock);
   };

   /**
    *
    * loadClockSpec
    */
   loadClockSpec(): string {
      var ret = this.store.loadValue(lastClockId);
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
      this.store.saveValue(lastClockStateId, clock);
   };

   /**
    *
    * loadClockState
    */
   loadClockState(): string {
      var ret = this.store.loadValue(lastClockStateId);
      if (!ret)
         ret = "";
      return ret;
   };
}