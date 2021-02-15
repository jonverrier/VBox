/*! Copyright TXPCo, 2020 */

declare var require: any

import * as React from 'react';
import axios from 'axios';

import { Logger } from './logger'


var logger = new Logger();

interface ILoginFbProps {
   autoLogin: Boolean;
   onLoginStatusChange: (boolean) => void;
}

interface ILoginFbState {
   isLoggedIn: boolean;
   name: string;
   thumbnailUrl: string;
   userAccessToken: string;
}

/* https://blog.cloudboost.io/waiting-till-facebook-sdk-or-any-other-async-sdk-has-loaded-6682839b9538 */
function Deferred() {
   var self = this;
   this.promise = new Promise(function (resolve, reject) {
      self.reject = reject
      self.resolve = resolve
   })
}
(window as any).fbLoaded = (new Deferred());

export class LoginFb {
   //member variables
   props: ILoginFbProps;
   state: ILoginFbState;

   constructor(props: ILoginFbProps) {       

      this.state = { isLoggedIn: false, thumbnailUrl: null, name: null, userAccessToken: null };
      this.props = props;
   }

   loadAPI() {
      var self = this;

      (window as any).fbAsyncInit = function () {
         (window as any).FB.init({
            appId: '1420468678202442',
            cookie: true,  // enable cookies to allow the server to access the session
            status: true,  // Check login status
            xfbml: false,  // do not parse social plugins on this page
            version: 'v9.0' // use version 9
         });

         // If enabled, and the user is logged in already, 
         // this will automatically redirect the page to the users home page.
         if (self.props.autoLogin)
            self.logIn (false);
      };

      // Load the SDK asynchronously
      (function (d, s, id) {
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) return;
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));

      this.testSession();
   }

   testSession() {
      axios.post('/api/sessiontest', { params: {} })
         .then((response) => {
            if (response.data && !response.data.session) {
               window.location.href = "auth/facebook";
            }
         })
         .catch((e) => {
            logger.error('LoginFb', 'testSession', 'Error:', e);
         });
   }

   getUserData(redirect, accessToken) {
      var self = this;

      (window as any).FB.api('/me', { fields: 'id, name' }, function (response) {
         if (response && response.name) {
            var name = response.name;

            var thumbnailUrl = 'https://graph.facebook.com/' + response.id.toString() + '/picture';
            self.processUserData(redirect, name, thumbnailUrl, accessToken);
         } else {
            self.processUserData(redirect, 'Unknown', 'person-w-128x128.png', null);
         }
      });
   }

   processUserData(redirect, name, url, token) {
      var self = this;

      self.state = ({ isLoggedIn: true, thumbnailUrl: url, name: name, userAccessToken: token });
      self.props.onLoginStatusChange(true);
   }

   processFBLoginData(redirect, response) {
      var self = this;

      if (response.status === 'connected') {
         self.getUserData(false, response.authResponse.accessToken);
      }
      else if (response.status === 'not_authorized') {
         self.state = { isLoggedIn: false, thumbnailUrl: null, name: null, userAccessToken: null };
         self.props.onLoginStatusChange(false);
      }
      else {
         self.state = { isLoggedIn: false, thumbnailUrl: null, name: null, userAccessToken: null };

         // TODO - cannot work out why local host does not work for FB API, this is a hack. 
         if (location.hostname.includes('localhost')) {
            logger.info('LoginComponent', 'loginCallback', 'Faking login on localhost.', null);
            self.state = { isLoggedIn: false, name: 'Fake Name', thumbnailUrl: 'person-w-128x128.png', userAccessToken: 'fake_token' };
            self.processUserData(false, self.state.name, self.state.thumbnailUrl, self.state.userAccessToken);
         } else {
            if (redirect) 
               window.location.href = "auth/facebook";
         }
      }
   }

   processFBLoginResponse(redirect) {
      var self = this;

      (window as any).FB.getLoginStatus(function (response) {
         self.processFBLoginData(redirect, response);
      }, redirect);
   }

   logInFromClick() {
      this.logIn(true); 
   }

   logIn(redirect) {
      var self = this;
      (window as any).FB.login(self.processFBLoginResponse(redirect), { scope: 'public_profile' });
   }

   logOut() {
      var self = this;
      (window as any).FB.logout(function () {
         self.state = { isLoggedIn: false, thumbnailUrl: null, name: null, userAccessToken: null };
         self.props.onLoginStatusChange(false);
         // Go back to front page.
         window.location.href = "/";
      });
   }
}
