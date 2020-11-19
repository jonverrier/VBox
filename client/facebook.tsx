declare var require: any

import * as React from 'react';
import Button from 'react-bootstrap/Button';

interface IProps {
}

interface IState {
   userPrompt : string;
}

export class LoginComponent extends React.Component<IProps, IState> {
   //member variables
   isLoggedIn: boolean;
   name: string;
   thumbnailUrl: string;
   userAccessToken: string;

   userPrompt: string;

   constructor(props : IProps) {
      super(props);
      this.loadAPI = this.loadAPI.bind(this);
      this.handleLogin = this.handleLogin.bind(this);
      this.checkLoginResponse = this.checkLoginResponse.bind(this);
      this.loginCallback = this.loginCallback.bind(this);

      this.isLoggedIn = false;
      this.name = null;
      this.thumbnailUrl = null;
      this.userAccessToken = null;
      this.userPrompt = "Login with Facebook";

      this.state = { userPrompt: this.userPrompt };
   }

   loadAPI() {
      var self = this;

      (window as any).fbAsyncInit = function () {
         (window as any).FB.init({
            appId: '1420468678202442',
            cookie: true,  // enable cookies to allow the server to access the session
            xfbml: false,  // do not parse social plugins on this page
            status: true,  // Check users status immediately after init
            version: 'v9.0' // use version 9
         });

         // self.checkLoginResponse(true);
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

   getUserData() {
      var self = this;

      (window as any).FB.api('/me', { fields: 'id, name, email'}, function (response) {
         self.name = response.name;
         self.thumbnailUrl = 'https://graph.facebook.com/' + response.id.toString() + '/picture';
      });
   }

   loginCallback(response) {
      if (response.status === 'connected') {
         this.isLoggedIn = true;
         this.userAccessToken = response.authResponse.accessToken;
         this.userPrompt = "Continue with Facebook";
         this.getUserData();

         this.setState({ userPrompt: this.userPrompt });

         // redirect to the server login age that will look up roles and then redirect the client
         window.location.href = "auth/facebook";
      }
      else if (response.status === 'not_authorized') {
         this.isLoggedIn = false;
      }
      else {
         this.isLoggedIn = false;
      }
   }

   checkLoginResponse(force) {
      var self = this;

      (window as any).FB.getLoginStatus(function (response) {
         self.loginCallback(response);
      }, force);
   }

   handleLogin() {
      (window as any).FB.login(this.checkLoginResponse (true), { scope: 'public_profile, email' });
   }

   render() {
      return (
         <p>
            <Button variant="primary" onClick={this.handleLogin}>{this.state.userPrompt}</Button>
         </p>
      );
   }
}


