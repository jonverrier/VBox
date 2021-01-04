/*! Copyright TXPCo, 2020 */

declare var require: any

import * as React from 'react';
import Button from 'react-bootstrap/Button';

interface ILoginProps {
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

   getUserData(accessToken) {
      var self = this;

      (window as any).FB.api('/me', { fields: 'id, name' }, function (response) {
         var name = response.name;
         var thumbnailUrl = 'https://graph.facebook.com/' + response.id.toString() + '/picture';
         self.setState({ isLoggedIn: true, thumbnailUrl: thumbnailUrl, name: name, userAccessToken: accessToken });
         self.props.onLoginStatusChange(true);
      });
   }

   loginCallback(response) {
      if (response.status === 'connected') {
         this.getUserData(response.authResponse.accessToken);
         // redirect to the server login age that will look up roles and then redirect the client
         // window.location.href = "auth/facebook";
      }
      else if (response.status === 'not_authorized') {
         this.setState({ isLoggedIn: false, thumbnailUrl: null, name: null, userAccessToken: null });
         this.props.onLoginStatusChange(false);
      }
      else {
         this.setState({ isLoggedIn: false, thumbnailUrl: null, name: null, userAccessToken: null });
         this.props.onLoginStatusChange(false);
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
      if (this.state.isLoggedIn) {
         return (
            <p>
               <Button variant="primary" onClick={this.handleLogin}>{this.state.userPrompt}</Button>
               <img src={this.state.thumbnailUrl} alt={this.state.name} title={this.state.name}height='48px' />
            </p>
         );
      } else {
         return (
            <p>
               <Button variant="primary" onClick={this.handleLogin}>{this.state.userPrompt}</Button>
            </p>
         );
      }
   }
}


