// GymClock spec is a 'templae' for a clock - how log, wether to play music, and which music.
// GymClockAction is a way to send the start, pause, stop list via Rpc
// GymClockState is a class to represent the state of a running clock - is is started, stopped, paused etc, and if running, for how long. 
// GymClock is a running clock - created from a spec, then can start, stop, pause etc. 

import { GymClockDurationEnum, GymClockMusicEnum, GymClockStateEnum, GymClockActionEnum, GymClockSpec, GymClockAction, GymClockState } from '../../core/dev/GymClock'

const countDownSeconds : number = 15;

// Keep this function need declation in case an extra Enum is added above & this needs to change
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
// GymClock class
//==============================//
export class GymClock  {
   clockSpec: GymClockSpec; 
   clockStateEnum: GymClockStateEnum;
   secondsCounted: number; 
   startReference: Date; 
   countToSeconds: number;
   audio: HTMLAudioElement;
   intervalId: any;
   callbackFn: Function;

   /**
    * Create a GymClock object
    */
   constructor (clockSpec) {
      this.clockSpec = clockSpec;
      this.clockStateEnum = GymClockStateEnum.Stopped;
      this.secondsCounted = 0;
      this.startReference = new Date();
      this.countToSeconds = 0;
      this.intervalId = null;
      this.callbackFn = null;

      if (this.clockSpec.musicUrl) {
         this.audio = new Audio();
         this.audio.src = this.clockSpec.musicUrl;
         this.audio.loop = true;
      } else
         this.audio = null;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: GymClock): boolean {

      return (this.clockSpec.equals(rhs.clockSpec)
         && this.clockStateEnum == rhs.clockStateEnum
         && this.secondsCounted === rhs.secondsCounted
         && this.startReference.getTime() === rhs.startReference.getTime()
         && this.countToSeconds === rhs.countToSeconds);
   };

   start (callbackFn: Function, secondsPlayed : number): void {

      if (secondsPlayed)
         this.secondsCounted = secondsPlayed;
      
      this.countToSeconds = calculateCountToSeconds(this.clockSpec.durationEnum);
      if (this.intervalId) {
         clearInterval(this.intervalId);
         this.intervalId = null;
      }
      this.intervalId = setInterval(this.onClockInterval.bind(this), 200);

      // Set effective start time by working out the duration of any ticks already counted
      this.startReference.setTime(new Date().getTime() - this.secondsCounted * 1000);

      if (this.secondsCounted >= countDownSeconds)
         this.clockStateEnum = GymClockStateEnum.Running;
      else
         this.clockStateEnum = GymClockStateEnum.CountingDown;

      this.callbackFn = callbackFn;

      if (this.audio) {
         this.audio.currentTime = this.secondsCounted;
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
      this.clockStateEnum = GymClockStateEnum.Stopped;
      this.secondsCounted = 0;
      this.countToSeconds = calculateCountToSeconds(this.clockSpec.durationEnum);

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

      this.clockStateEnum = GymClockStateEnum.Paused;
   };

   onClockInterval () : void {

      var now, mm, ss, seconds;

      now = new Date();
      seconds = (now.getTime() - this.startReference.getTime()) / 1000;
      this.secondsCounted = seconds;

      if (this.clockStateEnum === GymClockStateEnum.CountingDown && seconds < countDownSeconds) {

         mm = Math.floor((countDownSeconds - seconds) / 60);
         ss = Math.floor(countDownSeconds - (mm * 60) - seconds);
      } else {
         if (this.clockStateEnum = GymClockStateEnum.CountingDown) {
            this.clockStateEnum = GymClockStateEnum.Running;
         } 

         mm = Math.floor((seconds - countDownSeconds) / 60);
         ss = Math.ceil(seconds - countDownSeconds - Math.floor(mm * 60)); // Switch from floor to Ceil Compensate for passing zero in common across two counters
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

      return (this.clockStateEnum === GymClockStateEnum.CountingDown)
         || (this.clockStateEnum === GymClockStateEnum.Running);
   };

   canPause () : boolean {

      return (this.clockStateEnum === GymClockStateEnum.CountingDown)
         || (this.clockStateEnum === GymClockStateEnum.Running);
   };

   canStop (): boolean {

      return (this.clockStateEnum === GymClockStateEnum.Paused)
         || (this.clockStateEnum === GymClockStateEnum.CountingDown)
         || (this.clockStateEnum === GymClockStateEnum.Running);
   };

   canStart () : boolean {

      return (this.clockStateEnum === GymClockStateEnum.Paused)
         || (this.clockStateEnum === GymClockStateEnum.Stopped);
   };

   saveToState(): GymClockState {

      return new GymClockState(this.clockStateEnum, this.secondsCounted);
   };

   loadFromState(state: GymClockState, callbackFn: Function) {

      switch (state.stateEnum) {
         case GymClockStateEnum.Stopped:
            if (this.canStop())
               this.stop();
            break;
         case GymClockStateEnum.CountingDown:
         case GymClockStateEnum.Running:
            if (this.canStart())
               this.start(callbackFn, state.secondsIn);
            break;
         case GymClockStateEnum.Paused:
            if (this.canPause())
               this.pause();
            break;
      }
   };
}