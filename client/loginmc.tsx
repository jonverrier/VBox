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
}

export class LoginMc {
   //member variables
   props: ILoginMcProps;
   state: ILoginMcState;

   constructor(props: ILoginMcProps) {

      this.state = { isLoggedIn: false, meetCode: "", name: "", isValidMeetCode: false };
      this.props = props;
   }

   handleMeetCodeChange(ev: any) {
      this.state.meetCode = ev.target.value;  
      if (this.state.meetCode.length > 9) {
         this.state.isValidMeetCode = true;
      } else {
         this.state.isValidMeetCode = false;
      }

      this.props.onLoginReadinessChange(this.isLoginReady());
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


