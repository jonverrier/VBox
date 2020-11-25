/*! Copyright TXPCo, 2020 */

declare var require: any

import * as React from 'react';

interface IRtcState {
}

export interface IRtcProps {
   facilityId: string
}
export class Rtc extends React.Component<IRtcProps, IRtcState> {

   //member variables
   connection : RTCPeerConnection;
   facilityId: string;

   constructor(props: IRtcProps) {
      super(props);

      this.facilityId = props.facilityId;
   }

   componentDidMount() {
      var self = this;

      // Connect to the signalling server
      let configuration = {
         iceServers: [{ "urls": "stun:stun.1.google.com:19302" }]
      }; 

      this.connection = new RTCPeerConnection (configuration);

      // Get a data channel, will connect later on when we get 
      this.connection.onicecandidate = this.onicecandidate;
   }

   getSession() {
      var self = this;

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

