// GymClock spec is a 'templae' for a clock - how log, wether to play music, and which music.
// GymClockAction is a way to send the start, pause, stop list via Rpc
// GymClockState is a class to represent the state of a running clock - is is started, stopped, paused etc, and if running, for how long. 
// RunnableClock is a running clock - created from a spec, then can start, stop, pause etc.

import { EGymClockDuration, EGymClockMusic, EGymClockState, GymClockSpec, GymClockState } from '../../core/dev/GymClock';

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
   private _startTime: Date;
   private _targetRunInSeconds: number;
   private _audio: HTMLAudioElement;
   private _intervalId: any;
   private _callbackFn: Function;
   private _userAllowsAudio: boolean;

   /**
    * Create a RunnableClock object
    */
   constructor (clockSpec) {
      this._clockSpec = clockSpec;
      this._clockStateEnum = EGymClockState.Stopped;
      this._secondsCounted = 0;
      this._startTime = new Date();
      this._targetRunInSeconds = 0;
      this._intervalId = null;
      this._callbackFn = null;
      this._userAllowsAudio = false;

      if (this._clockSpec.musicUrl) {
         this._audio = new Audio();
         this._audio.src = this._clockSpec.musicUrl;
         this._audio.loop = true;
      } else
         this._audio = null;
   }

   /**
   * set of 'getters' for private variables
   */
   get clockSpec(): GymClockSpec {
      return this._clockSpec;
   }
   get stateEnum(): EGymClockState {
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
         && this._startTime.getTime() === rhs._startTime.getTime()
         && this._targetRunInSeconds === rhs._targetRunInSeconds
         && this._userAllowsAudio === rhs._userAllowsAudio);
   };

   start(callbackFn: Function, userAllowsAudio: boolean, secondsPlayed? : number): void {

      this._userAllowsAudio = userAllowsAudio;

      if (secondsPlayed)
         this._secondsCounted = secondsPlayed;

      if (this._secondsCounted >= countDownSeconds)
         this._clockStateEnum = EGymClockState.Running;
      else
         this._clockStateEnum = EGymClockState.CountingDown;

      this._targetRunInSeconds = calculateCountToSeconds(this._clockSpec.durationEnum);
      if (this._intervalId) {
         clearInterval(this._intervalId);
         this._intervalId = null;
      }

      this._intervalId = setInterval(this.onClockInterval.bind(this), 200);

      // Set effective start time by working out the duration of any ticks already counted
      this._startTime.setTime(new Date().getTime() - this._secondsCounted * 1000);

      this._callbackFn = callbackFn;

      if (this._audio && this._userAllowsAudio) {
         this._audio.currentTime = this._secondsCounted;
         this._audio.play();
      }

      // call first tick to start the visible clock
      this.onClockInterval();
   };

   stop () : void {
      if (this._intervalId) {
         clearInterval(this._intervalId);
         this._intervalId = null;
      }
      this._clockStateEnum = EGymClockState.Stopped;
      this._secondsCounted = 0;
      this._targetRunInSeconds = calculateCountToSeconds(this._clockSpec.durationEnum);

      if (this._audio && this._userAllowsAudio)
         this._audio.pause();

      if (this._callbackFn)
         this._callbackFn(0, 0);
   };

   pause () : void {
      if (this._intervalId) {
         clearInterval(this._intervalId);
         this._intervalId = null;
      }
      if (this._audio && this._userAllowsAudio)
         this._audio.pause();

      this._clockStateEnum = EGymClockState.Paused;
   };

   mute(): void {
      // Return if there is no state change
      if (!this._userAllowsAudio)
         return;

      if (this._audio && this.isRunning())
         this._audio.muted = true;

      this._userAllowsAudio = false;
   }

   unMute(): void {

      // Return if there is no state change
      if (this._userAllowsAudio)
         return;

      if (this._audio && this.isRunning()) {
         this._audio.muted = false;
         this._audio.currentTime = this._secondsCounted;
         this._audio.play();
      }

      this._userAllowsAudio = true;
   }

   onClockInterval () : void {

      var now, mm, ss, seconds;

      now = new Date();
      seconds = (now.getTime() - this._startTime.getTime()) / 1000;
      this._secondsCounted = seconds;

      if (this._clockStateEnum === EGymClockState.CountingDown
         && seconds < countDownSeconds) {

         mm = Math.floor((countDownSeconds - seconds) / 60);
         ss = Math.floor(countDownSeconds - (mm * 60) - seconds);
      } else {
         if (this._clockStateEnum === EGymClockState.CountingDown) {
            this._clockStateEnum = EGymClockState.Running;
         } 

         // Switch from floor to Ceil to compensate for passing zero in common across count down then count up
         mm = Math.floor((seconds - countDownSeconds) / 60);
         ss = Math.ceil(seconds - countDownSeconds - Math.floor(mm * 60)); 
         if (seconds >= this._targetRunInSeconds) {
            mm = (this._targetRunInSeconds - countDownSeconds) / 60;
            ss = 0;
            this.stop();
         }
      }
      if (this._callbackFn)
         this._callbackFn(mm, ss);
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
               this.start(callbackFn, this._userAllowsAudio, state.secondsCounted);
            break;
         case EGymClockState.Paused:
            if (this.canPause())
               this.pause();
            break;
      }
   };
}