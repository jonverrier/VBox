/*! Copyright TXPCo, 2020 */

declare var require: any

import * as React from 'react';

import axios from 'axios';

// This app
import { Call, CallParticipant} from '../common/call.js';
import { TypeRegistry } from '../common/types.js';

interface IRtcState {
}

export interface IRtcProps {
   facilityId: string;
   personId: string;
}
export class Rtc extends React.Component<IRtcProps, IRtcState> {

   //member variables
   connection: RTCPeerConnection;
   events: EventSource;
   call: Call;
   defaultCall: Call;

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

      // Get a data channel, will connect later on when we get a proper facilityId as the user logs in
      this.connection.onicecandidate = this.onicecandidate;
      this.connection.onnegotiationneeded = this.onnegotiationneeded;
      this.connection.ondatachannel = this.ondatachannel;

      this.events = null; 

      // ICE enumeration does not start until we create a local description, so call createOffer() to kick this off
      const offer = this.connection.createOffer();
      offer.then(
         function (sessionDescriptionInit) {
            console.log('createOffer success ' + JSON.stringify (sessionDescriptionInit));
            self.connection.setLocalDescription(sessionDescriptionInit);
         },
         function (err) {
            console.log('createOffer fail ' + JSON.stringify(err));
         });

      this.call = this.defaultCall = new Call(null, null);
   }

   getSession() {
      var self = this;
      const callParticipant = new CallParticipant(null, self.props.facilityId, self.props.personId);
      const sourceUrl = '/call/' + JSON.stringify(self.props.facilityId);

      self.events = new EventSource(sourceUrl);

      self.events.addEventListener('message', self.ongroupevents, false);

      // Send our call participant data in
      axios.get('/api/call', { params: { callParticipant: callParticipant } })
         .then(function (response) {
            self.call = self.call.revive(response.data);
            // TODO
            // Read the returned data about current status of the call

            //self.setState({ pageData: self.pageData });
         })
         .catch(function (error) {
            // handle error by setting state back to no user logged in
            self.call = self.defaultCall;
            //self.setState({ pageData: self.pageData });
         });

   }

   componentDidUpdate(prevProps) {
      if (prevProps.facilityId !== this.props.facilityId) {
         this.getSession();
      }
   }

   ongroupevents(ev) {
      console.log(JSON.stringify(ev));
   }

   onicecandidate(ev) {
      console.log(JSON.stringify (ev));
   }

   onnegotiationneeded () {
      var self = this;

      console.log('onnegotiationneeded');
   };

   ondatachannel(ev) {
      console.log(JSON.stringify(ev));
   }

   componentWillUnmount() {
      // Disconnect from the signalling server ? 
   }

   render() {
      return (<div></div>);
   }
}

