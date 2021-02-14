/*! Copyright TXPCo, 2020 */

declare var require: any

import * as React from 'react';

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

export class LoginFb {
   //member variables
   props: ILoginFbProps;
   state: ILoginFbState;

   constructor(props: ILoginFbProps) {

      this.logIn = this.logIn.bind(this); 
      this.logOut = this.logOut.bind(this); 
      this.processFBLoginResponse = this.processFBLoginResponse.bind(this); 
      this.processFBLoginData = this.processFBLoginData.bind(this);       

      this.state = { isLoggedIn: false, thumbnailUrl: null, name: null, userAccessToken: null };
      this.props = props;
   }

   loadAPI() {
      var self = this;

      (window as any).fbAsyncInit = function () {
         (window as any).FB.init({
            appId: '1420468678202442',
            cookie: true,  // enable cookies to allow the server to access the session
            xfbml: false,  // do not parse social plugins on this page
            version: 'v9.0' // use version 9
         });

         // If enabled, and the user is logged in already, 
         // this will automatically redirect the page to the users home page.
         //if (self.props.autoLogin)
         //   self.processFBLoginResponse(true);
         // Disabled - we want the user to click something, so we get access to play sounds etc. 
      };

      // Load the SDK asynchronously
      (function (d, s, id) {
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) return;
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
   }

   getUserData(accessToken) {
      var self = this;

      (window as any).FB.api('/me', { fields: 'id, name' }, function (response) {
         var name = response.name;
         var thumbnailUrl = 'https://graph.facebook.com/' + response.id.toString() + '/picture';
         self.processUserData(name, thumbnailUrl, accessToken);
      });
   }

   processUserData(name, url, token) {
      var self = this;

      self.state = ({ isLoggedIn: true, thumbnailUrl: url, name: name, userAccessToken: token });

      // if we are not already on a validated path, redirect to the server login page that will look up roles and then redirect the client
      if (!(location.pathname.includes('coach') || location.pathname.includes('member'))) {
         window.location.href = "auth/facebook";
      }
      self.props.onLoginStatusChange(true);
   }

   processFBLoginData(response) {
      var self = this;

      if (response.status === 'connected') {
         self.getUserData(response.authResponse.accessToken);
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
            self.processUserData(self.state.name, self.state.thumbnailUrl, self.state.userAccessToken);
         } else {
            self.props.onLoginStatusChange(false);
         }
      }
   }

   processFBLoginResponse(force) {
      var self = this;

      (window as any).FB.getLoginStatus(function (response) {
         self.processFBLoginData(response);
      }, force);
   }

   logIn() {
      var self = this;
      (window as any).FB.login(self.processFBLoginResponse (true), { scope: 'public_profile' });
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
