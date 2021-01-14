/*! Copyright TXPCo, 2020 */
// Component to support Login via a meeting code

declare var require: any

import * as React from 'react';
import axios from 'axios';

import { Logger } from './logger'

var logger = new Logger();

interface ILoginMcProps {
   autoLogin: Boolean;
   onLoginReadinessChange: (boolean) => void;
   onLoginStatusChange: (boolean) => void;
}

interface ILoginMcState {
   isLoggedIn: boolean;
   name: string;
   meetCode: string;
   isValidMeetCode: boolean;
   isTimerPending: boolean;
}

export class LoginMc {
   //member variables
   props: ILoginMcProps;
   state: ILoginMcState;

   constructor(props: ILoginMcProps) {

      this.state = { isLoggedIn: false, meetCode: "", name: "", isValidMeetCode: false, isTimerPending : false};
      this.props = props;
   }

   handleMeetCodeChange(ev: any) {
      this.state.meetCode = ev.target.value;  
      var self = this;

      // make at most one call per second to the server to check for a valid meet code
      if (!this.state.isTimerPending) {
         this.state.isTimerPending = true;

         setTimeout(function () {
            axios.get('/api/isvalidmc', { params: { meetingId: encodeURIComponent(self.state.meetCode) } })
               .then(function (response) {
                  self.state.isTimerPending = false;
                  self.state.isValidMeetCode = response.data ? true : false;
                  self.props.onLoginReadinessChange(self.isLoginReady());
               })
               .catch(function (error) {
                  self.state.isTimerPending = false;
                  self.props.onLoginReadinessChange(self.isLoginReady());
               });
         }, 1000);
      }
   }

   handleNameChange(ev: any) {
      this.state.name = ev.target.value;

      this.props.onLoginReadinessChange(this.isLoginReady());
   }

   isValidName(): boolean {
      return this.state.name.length > 0;
   }

   isValidMeetCode(): boolean {
      return this.state.isValidMeetCode;
   }

   isLoginReady(): boolean {
      return this.state.name.length > 0 && this.state.isValidMeetCode;
   }

   logIn() {

      /* if () {
         self.props.onLoginStatusChange(false);
      } */
   }

   logOut() {
   }
}


