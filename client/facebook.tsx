/*! Copyright TXPCo, 2020 */

declare var require: any

import * as React from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

import { Logger } from './logger'

var logger = new Logger();

interface ILoginProps {
   show: boolean;
   onLoginStatusChange: (boolean) => void;
}

interface ILoginState {
   isLoggedIn: boolean;
   userPrompt: string;
   thumbnailUrl: string;
   name: string;
   userAccessToken: string;
}

export class LoginComponent extends React.Component<ILoginProps, ILoginState> {
   //member variables

   constructor(props : ILoginProps) {
      super(props);
      this.loadAPI = this.loadAPI.bind(this);
      this.handleLogin = this.handleLogin.bind(this);
      this.checkLoginResponse = this.checkLoginResponse.bind(this);
      this.loginCallback = this.loginCallback.bind(this);

      var userPrompt = "Login with Facebook";

      this.state = { isLoggedIn: false, userPrompt: userPrompt, thumbnailUrl: null, name: null, userAccessToken : null };
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

   componentWillUnmount() {
   }

   login(name, url, token) {
      this.setState({ isLoggedIn: true, thumbnailUrl: url, name: name, userAccessToken: token });

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
      });
   }

   loginCallback(response) {
      if (response.status === 'connected') {
         this.getUserData(response.authResponse.accessToken);
      }
      else if (response.status === 'not_authorized') {
         this.setState({ isLoggedIn: false, thumbnailUrl: null, name: null, userAccessToken: null });
         this.props.onLoginStatusChange(false);
      }
      else {
         this.setState({ isLoggedIn: false, thumbnailUrl: null, name: null, userAccessToken: null });

         // TODO - cannot work out why local host does not work for FB API, this is a hack. 
         if (location.hostname.includes('localhost')) {
            logger.info('LoginComponent', 'loginCallback', 'Faking login on localhost.', null);
            this.setState({ isLoggedIn: false, thumbnailUrl: 'person-w-128x128.png', name: 'Fake Name', userAccessToken: 'fake_token' });
            this.login(this.state.name, this.state.thumbnailUrl, this.state.userAccessToken);
            this.props.onLoginStatusChange(true);
         } else {
            this.props.onLoginStatusChange(false);
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
      (window as any).FB.login(this.checkLoginResponse (true), { scope: 'public_profile' });
   }

   render() {
      if (this.props.show) {
         return (
            <p>
               <Button variant="primary" onClick={this.handleLogin}>{this.state.userPrompt}</Button>
            </p>
         );
      } else {
         return (<div />);
      }
   }
}


