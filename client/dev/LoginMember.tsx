/*! Copyright TXPCo, 2020, 2021 */
// LoginInterfaces - defines abstract interfaces for LoginProvider, LoginData, ...
// LoginMeetingCode - helper class to encapsulate validating a meeting code
// LonginMember - login classes to log members in with just meeting code and name
// LoginOauth - login via Oath, currently facebook.

// external components
import axios from 'axios';

// This app, this component
import { LoggerFactory, ELoggerType } from '../../core/dev/Logger';
import { ILoginProvider, ILoginData } from './LoginInterfaces';
import { LoginMeetCodeData } from './LoginMeetingCode';

var logger = new LoggerFactory().createLogger(ELoggerType.Client, true);

export class MemberLoginData extends LoginMeetCodeData {
   static readonly _memberMagicNumber: number = 0x4203a0d3; // pasted from
   // https://onlinehextools.com/generate-random-hex-numbers

   private _name: string;

   constructor(meetCode: string, name: string) {
      super(meetCode);
      super.onDataReadiness = this.onDataReadinessInner.bind(this);
      this.name = name;
   }

   /**
   * set of 'getters' & 'setters' for private variables
   */

   get name(): string {
      return this._name;
   }

   set name(name: string) {
      var wasValid: boolean = this.isValid();
      this._name = name;
      var isValidNow: boolean = this.isValid();

      if (wasValid != isValidNow) {
         if (this.onDataReadiness) {
            this.onDataReadiness(isValidNow);
         }
      }
   }

   magicNumber(): number {
      return MemberLoginData._memberMagicNumber;
   }

   // Override this for notification from data validation 
   onDataReadiness: ((isSuccessful: boolean) => void) | null;

   // Hook for data readiness changes from superclass
   onDataReadinessInner(isSuccessful: boolean): void {
      if (this.onDataReadiness) {
         this.onDataReadiness(this.isValid())
      }
   }

   isValid(): boolean {

      if (super.isValid()
         && this.isValidName())
         return true;
      else
         return false;
   }

   isValidName(): boolean {
      return this._name.length > 0;
   }
}

function assertTrue(condition: boolean, msg: string): asserts condition {
   if (!condition) {
      logger.logError('MemberLoginProvider', 'assertTrue', msg, condition);
      throw new Error(msg);
   }
}

export class MemberLoginProvider implements ILoginProvider {

   private _loginData: MemberLoginData;

   constructor() {
      this._loginData = undefined;
   }

   // Override this for data from login process 
   onLoginReadiness: ((this: MemberLoginProvider, isSuccessful: boolean) => void) | null;
   onLoginResult: ((this: MemberLoginProvider, isSuccessful: boolean) => void) | null;

   load(): void {
      return; // Nothing to do on load for this provider
   }

   setLoginData(loginData: ILoginData) {

      assertTrue(loginData.magicNumber() === MemberLoginData._memberMagicNumber, 'Invalid magic number from ILoginData.');

      var casting: any = loginData;
      this._loginData = casting;

      if (this._loginData.isValid()) {

         // as soon as vald data is provided, we can log in. 
         if (this.onLoginReadiness)
            this.onLoginReadiness(true);
      } else {
         if (this.onLoginReadiness)
            this.onLoginReadiness(false);
      }
   }

   login(fromUserClick?: boolean): void {
      var self = this;

      axios.get('/auth/local', {
         params: {
            meetingId: encodeURIComponent(this._loginData.meetCode),
            name: encodeURIComponent(this._loginData.name)
         }
      })
         .then(function (response) {
            if (response.data) {
               if (self.onLoginResult)
                  self.onLoginResult(true);

               // if we are not already on a validated path, redirect 
               if (!(location.pathname.includes('member'))) {
                  window.location.href = "member";
               }
            } else {
               if (self.onLoginResult)
                  self.onLoginResult(false);
            }
         })
         .catch(function (error) {
            if (self.onLoginResult)
               self.onLoginResult(false);
         });
   }

   testLogin(): boolean {
      // No notion of a pre-login with member-based login, as need to get session established with server
      return false; 
   }

   logout(): void {
      axios.post('/auth/logout', { params: { null: null } })
         .then((response) => {
            window.location.href = "/";
         })
         .catch((e) => {
            logger.logError('MemberLoginProvider', 'logout', 'Error:', e);
            window.location.href = "/";
         });
   }
}



