/*! Copyright TXPCo, 2020, 2021 */
// LoginInterfaces - defines abstract interfaces for LoginProvider, LoginData, ...
// LoginMeetingCode - helper class to encapsulate validating a meeting code
// LonginMember - login classes to log members in with just meeting code and name
// LoginOauth - login via Oath, currently facebook.

// external components
import axios from 'axios';

// This app, this component
import { LoggerFactory, ELoggerType } from '../../core/dev/Logger';
import { ILoginProvider, ILoginData } from './LoginInterfaces'

var logger = new LoggerFactory().createLogger(ELoggerType.Client, true);

const meetCodelength: number = 10;

export class LoginMeetCodeData implements ILoginData {
   static readonly _meetCodeMagicNumber: number = 0xdbb0641fa; // pasted from 
   // https://onlinehextools.com/generate-random-hex-numbers

   private _meetCode: string;
   private _isTimerPending: boolean;
   private _isValidMeetCode: boolean;

   constructor(meetCode: string) {
      this._isTimerPending = false;
      this._isValidMeetCode = false;
      this._meetCode = meetCode;
      this.validateMeetCode();
   }

   /**
   * set of 'getters' & 'setters' for private variables
   */
   get meetCode(): string {
      return this._meetCode;
   }

   set meetCode(newMeetCode: string) {

      this._meetCode = newMeetCode;
      this.validateMeetCode();
    }

   magicNumber(): number {
      return LoginMeetCodeData._meetCodeMagicNumber;
   }

   // Override this for notification from data validation 
   onDataReadiness: ((this: LoginMeetCodeData, isSuccessful: boolean) => void) | null;

   isValid(): boolean {

      if (this.isValidMeetCode() && !this._isTimerPending)
         return true;
      else
         return false;
   }

   isValidMeetCode(): boolean {
      return this._isValidMeetCode;
   }

   private validateMeetCode() {
      var self = this;

      // make at most one call per 500ms to the server to check for a valid meet code
      if (!self._isTimerPending) {
         self._isTimerPending = true;

         setTimeout(function () {
            self._isTimerPending = false;
            axios.get('/api/isvalidmc', { params: { meetingId: encodeURIComponent(self._meetCode) } })
               .then(function (response) {
                  self._isValidMeetCode = response.data ? true : false;
                  if (self.onDataReadiness)
                     self.onDataReadiness(self.isValid());
               })
               .catch(function (error) {
                  if (self.onDataReadiness)
                     self.onDataReadiness(self.isValid());
               });
         }, 500);
      }
   }
}



