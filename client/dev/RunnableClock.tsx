// GymClock spec is a 'templae' for a clock - how log, wether to play music, and which music.
// GymClockAction is a way to send the start, pause, stop list via Rpc
// GymClockState is a class to represent the state of a running clock - is is started, stopped, paused etc, and if running, for how long. 
// RunnableClock is a running clock - created from a spec, then can start, stop, pause etc.

import { EGymClockDuration, EGymClockMusic, EGymClockState, EGymClockAction, GymClockSpec, GymClockAction, GymClockState } from '../../core/dev/GymClock'

const countDownSeconds : number = 15;

// Keep this function need declation in case an extra Enum is added above & this needs to change
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
// RunnableClock class
//==============================//
export class RunnableClock  {
   private _clockSpec: GymClockSpec; 
   private _clockStateEnum: EGymClockState;
   private _secondsCounted: number;
   private startReference: Date;
   private countToSeconds: number;
   private audio: HTMLAudioElement;
   private intervalId: any;
   private callbackFn: Function;

   /**
    * Create a RunnableClock object
    */
   constructor (clockSpec) {
      this._clockSpec = clockSpec;
      this._clockStateEnum = EGymClockState.Stopped;
      this._secondsCounted = 0;
      this.startReference = new Date();
      this.countToSeconds = 0;
      this.intervalId = null;
      this.callbackFn = null;

      if (this._clockSpec.musicUrl) {
         this.audio = new Audio();
         this.audio.src = this._clockSpec.musicUrl;
         this.audio.loop = true;
      } else
         this.audio = null;
   }

   /**
   * set of 'getters' for private variables
   */
   get clockSpec(): GymClockSpec {
      return this._clockSpec;
   }
   get clockStateEnum(): EGymClockState {
      return this._clockStateEnum;
   }
   get secondsCounted(): number {
      return this._secondsCounted;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: RunnableClock): boolean {

      return (this._clockSpec.equals(rhs._clockSpec)
         && this._clockStateEnum == rhs._clockStateEnum
         && this._secondsCounted === rhs._secondsCounted
         && this.startReference.getTime() === rhs.startReference.getTime()
         && this.countToSeconds === rhs.countToSeconds);
   };

   start (callbackFn: Function, secondsPlayed? : number): void {

      if (secondsPlayed)
         this._secondsCounted = secondsPlayed;

      if (this._secondsCounted >= countDownSeconds)
         this._clockStateEnum = EGymClockState.Running;
      else
         this._clockStateEnum = EGymClockState.CountingDown;

      this.countToSeconds = calculateCountToSeconds(this._clockSpec.durationEnum);
      if (this.intervalId) {
         clearInterval(this.intervalId);
         this.intervalId = null;
      }

      this.intervalId = setInterval(this.onClockInterval.bind(this), 200);

      // Set effective start time by working out the duration of any ticks already counted
      this.startReference.setTime(new Date().getTime() - this._secondsCounted * 1000);

      this.callbackFn = callbackFn;

      if (this.audio) {
         this.audio.currentTime = this._secondsCounted;
         this.audio.play();
      }

      // call first tick to start the visible clock
      this.onClockInterval();
   };

   stop () : void {
      if (this.intervalId) {
         clearInterval(this.intervalId);
         this.intervalId = null;
      }
      this._clockStateEnum = EGymClockState.Stopped;
      this._secondsCounted = 0;
      this.countToSeconds = calculateCountToSeconds(this._clockSpec.durationEnum);

      if (this.audio)
         this.audio.pause();

      if (this.callbackFn)
         this.callbackFn(0, 0);
   };

   pause () : void {
      if (this.intervalId) {
         clearInterval(this.intervalId);
         this.intervalId = null;
      }
      if (this.audio)
         this.audio.pause();

      this._clockStateEnum = EGymClockState.Paused;
   };

   onClockInterval () : void {

      var now, mm, ss, seconds;

      now = new Date();
      seconds = (now.getTime() - this.startReference.getTime()) / 1000;
      this._secondsCounted = seconds;

      if (this._clockStateEnum === EGymClockState.CountingDown
         && seconds < countDownSeconds) {

         mm = Math.floor((countDownSeconds - seconds) / 60);
         ss = Math.floor(countDownSeconds - (mm * 60) - seconds);
      } else {
         if (this._clockStateEnum === EGymClockState.CountingDown) {
            this._clockStateEnum = EGymClockState.Running;
         } 

         mm = Math.floor((seconds - countDownSeconds) / 60);
         ss = Math.ceil(seconds - countDownSeconds - Math.floor(mm * 60)); // Switch from floor to Ceil Compensate for passing zero in common across count down then count up
         if (seconds >= this.countToSeconds) {
            mm = (this.countToSeconds - countDownSeconds) / 60;
            ss = 0;
            this.stop();
         }
      }
      if (this.callbackFn)
         this.callbackFn(mm, ss);
   };

   isRunning () : boolean {

      return (this._clockStateEnum === EGymClockState.CountingDown)
         || (this._clockStateEnum === EGymClockState.Running);
   };

   canPause () : boolean {

      return (this._clockStateEnum === EGymClockState.CountingDown)
         || (this._clockStateEnum === EGymClockState.Running);
   };

   canStop (): boolean {

      return (this._clockStateEnum === EGymClockState.Paused)
         || (this._clockStateEnum === EGymClockState.CountingDown)
         || (this._clockStateEnum === EGymClockState.Running);
   };

   canStart () : boolean {

      return (this._clockStateEnum === EGymClockState.Paused)
         || (this._clockStateEnum === EGymClockState.Stopped);
   };

   saveToState(): GymClockState {

      return new GymClockState(this._clockStateEnum, this._secondsCounted);
   };

   loadFromState(state: GymClockState, callbackFn: Function) {

      switch (state.stateEnum) {
         case EGymClockState.Stopped:
            if (this.canStop())
               this.stop();
            break;
         case EGymClockState.CountingDown:
         case EGymClockState.Running:
            if (this.canStart())
               this.start(callbackFn, state.secondsIn);
            break;
         case EGymClockState.Paused:
            if (this.canPause())
               this.pause();
            break;
      }
   };
}