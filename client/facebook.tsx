/*! Copyright TXPCo, 2020 */

declare var require: any

import * as React from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

import { Logger } from './logger'

var logger = new Logger();

interface ILoginProps {
   onLoginStatusChange: (boolean) => void;
}

interface ILoginState {
   isLoggedIn: boolean;
   name: string;
   thumbnailUrl: string;
   userAccessToken: string;
}

export class LoginComponent {
   //member variables
   props: ILoginProps;
   state: ILoginState;

   constructor(props : ILoginProps) {

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
         self.checkLoginResponse(true);
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

   componentDidMount() {
      this.loadAPI();
   }

   login(name, url, token) {
      this.state = ({ isLoggedIn: true, thumbnailUrl: url, name: name, userAccessToken: token });

      // if we are not already on a validated path, redirect to the server login page that will look up roles and then redirect the client
      if (!(location.pathname.includes('coach') || location.pathname.includes('member'))) {
         window.location.href = "auth/facebook";
      }
   }

   getUserData(accessToken) {
      var self = this;

      (window as any).FB.api('/me', { fields: 'id, name' }, function (response) {
         var name = response.name;
         var thumbnailUrl = 'https://graph.facebook.com/' + response.id.toString() + '/picture';
         self.login(name, thumbnailUrl, accessToken);
         self.props.onLoginStatusChange(true);
      });
   }

   loginCallback(response) {
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
            self.login(self.state.name, self.state.thumbnailUrl, self.state.userAccessToken);
            self.props.onLoginStatusChange(true);
         } else {
            self.props.onLoginStatusChange(false);
         }
      }
   }

   checkLoginResponse(force) {
      var self = this;

      (window as any).FB.getLoginStatus(function (response) {
         self.loginCallback(response);
      }, force);
   }

   handleLogin() {
      var self = this;
      (window as any).FB.login(self.checkLoginResponse (true), { scope: 'public_profile' });
   }
}


