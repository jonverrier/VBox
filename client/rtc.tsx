/*! Copyright TXPCo, 2020 */

declare var require: any

import * as React from 'react';

import axios from 'axios';

// This app
import { OnlineClass } from '../common/onlineclass.js';
import { TypeRegistry } from '../common/types.js';

interface IRtcState {
}

export interface IRtcProps {
   facilityId: string
}
export class Rtc extends React.Component<IRtcProps, IRtcState> {

   //member variables
   connection: RTCPeerConnection;
   onlineClass: OnlineClass;
   defaultOnlineClass: OnlineClass;

   constructor(props: IRtcProps) {
      super(props);
   }

   componentDidMount() {
      var self = this;

      // Connect to the signalling server
      let configuration = {
         iceServers: [{ "urls": "stun:stun.1.google.com:19302" }]
      }; 

      this.connection = new RTCPeerConnection (configuration);

      this.onlineClass = this.defaultOnlineClass = new OnlineClass(null, null);
      // Get a data channel, will connect later on when we get a proper facilityId as the user logs in
      this.connection.onicecandidate = this.onicecandidate;
   }

   getSession() {
      var self = this;

      // Make a request for user data to populate the home page 
      axios.get('/api/onlineclass', { params: { facilityId: self.props.facilityId } })
         .then(function (response) {
            // Success, set state to data for logged in user 
            self.onlineClass = self.onlineClass.revive(response.data);
            //self.setState({ pageData: self.pageData });
         })
         .catch(function (error) {
            // handle error by setting state back to no user logged in
            self.onlineClass = self.defaultOnlineClass;
            //self.setState({ pageData: self.pageData });
         });

   }

   componentDidUpdate(prevProps) {
      if (prevProps.facilityId !== this.props.facilityId) {
         this.getSession();
      }
   }

   onicecandidate(ev) {
      console.log(ev);
   }

   componentWillUnmount() {
      // Disconnect from the signalling server ? 
   }

   render() {
      return (<div></div>);
   }
}

