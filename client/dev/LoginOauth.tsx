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
import { ClientUrl } from './ClientUrl';

var logger = new LoggerFactory().createLogger(ELoggerType.Client, true);

function assertTrue(condition: boolean, msg: string): asserts condition {
   if (!condition) {
      logger.logError('OauthLoginProvider', 'assertTrue', msg, condition);
      throw new Error(msg);
   }
}

export class LoginOauthProvider implements ILoginProvider {

   private _loginData: LoginMeetCodeData;

   constructor() {
      this._loginData = undefined;
   }

   // Override this for data from login process 
   onLoginReadiness: ((this: LoginOauthProvider, isSuccessful: boolean) => void) | null;
   onLoginResult: ((this: LoginOauthProvider, isSuccessful: boolean) => void) | null;

   load(): void {
      return; // Nothing to do on load for this provider
   }

   setLoginData(loginData: ILoginData) {

      assertTrue(loginData.magicNumber() === LoginMeetCodeData._meetCodeMagicNumber, 'Invalid magic number from ILoginData.');

      var casting: any = loginData;
      this._loginData = casting;

      if (this._loginData.isValid()) {

         // as soon as vald data is provided, we can log in. 
         // Note that this would be different if we locad local Facebook SDK - have to load it first. 
         if (this.onLoginReadiness)
            this.onLoginReadiness(true);
      } else {
         if (this.onLoginReadiness)
            this.onLoginReadiness(false);
      }
   }

   login(fromUserClick?: boolean): void {

      // pull meeting id from URL - if its the same as we sent, we are logged in. 
      // else we need to redirect to server login 
      let url = new ClientUrl(document.location.toString());

      if (url.queryParam('meetingId') === this._loginData.meetCode) {
         if (this.onLoginResult)
            this.onLoginResult(true);
         return;
      }
      else {
         window.location.href = '/auth/facebook?meetingId=' + encodeURIComponent(this._loginData.meetCode);
      }
   }

   testLogin(): boolean {

      // pull meeting id from URL - if its the same as we sent, we are logged in. 
      // else we need to redirect to server login 
      let url = new ClientUrl(document.location.toString());

      if (url.queryParam('meetingId') === this._loginData.meetCode) {
         if (this.onLoginResult)
            this.onLoginResult(true);
         return true;
      }
      else
         return false;
   }

   logout(): void {
      axios.post('/auth/logout', { params: { null: null } })
         .then((response) => {
            window.location.href = "/";
         })
         .catch((e) => {
            logger.logError('OauthLoginProvider', 'logout', 'Error:', e);
            window.location.href = "/";
         });
   }
}



