/*! Copyright TXPCo, 2020 */

declare var require: any

import * as React from 'react';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
 
// This app
import { Call, CallParticipant, CallOffer, CallAnswer, CallIceCandidate} from '../common/call.js';
import { TypeRegistry } from '../common/types.js';

interface IRtcState {
}

export interface IRtcProps {
   facilityId: string;
   personId: string;
}
export class Rtc extends React.Component<IRtcProps, IRtcState> {

   //member variables
   callParticipant: CallParticipant;
   callIn: RTCPeerConnection;
   callOut: RTCPeerConnection;
   events: EventSource;
   call: Call;
   defaultCall: Call;

   constructor(props: IRtcProps) {
      super(props);
      this.callIn = null;
      this.callOut = null;
   }

   componentDidMount() {
      var self = this;

      this.call = this.defaultCall = new Call(null, null);
      this.callParticipant = null;
   }

   getSession() {
      var self = this;
      this.callParticipant = new CallParticipant(null, self.props.facilityId, self.props.personId, uuidv4());
      const sourceUrl = '/callevents/?callParticipant=' + encodeURIComponent(JSON.stringify(this.callParticipant));
      this.events = new EventSource(sourceUrl);
      this.events.addEventListener('message', self.ongroupevents.bind(this), false);

      // Send our call participant data in
      axios.get('/api/call', { params: { callParticipant: this.callParticipant } })
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
      // Event source passes remote participant in the data
      var types = new TypeRegistry();
      var remoteCallData = types.reviveFromJSON(ev.data);

      switch (remoteCallData.__type) {
         case "CallParticipant":
            console.log('Participant:' + JSON.stringify(remoteCallData));
            this.onnewparticipant(remoteCallData);
            break;
         case "CallOffer":
            console.log('Offer:' + JSON.stringify(remoteCallData));
            this.onnewoffer(remoteCallData);
            break;
         case "CallAnswer":
            console.log('Answer:' + JSON.stringify(remoteCallData));
            this.onnewanswer(remoteCallData);
            break;
         case "CallIceCandidate":
            var outbound = true;
            console.log('IceCandidate:' + JSON.stringify(remoteCallData));
            this.onremoteicecandidate(remoteCallData);
            break;
         default:
            console.log('Default:'+JSON.stringify(remoteCallData));
            break;
      }
   }

   onnewparticipant(remoteParticipant) {
      var self = this;

      // Connect to the signalling server
      let configuration = {
         iceServers: [{ "urls": "stun:stun.1.google.com:19302" }]
      };

      this.callOut = new RTCPeerConnection(configuration);
      this.callOut.onicecandidate = (ice) => {
         self.onicecandidate(ice.candidate, remoteParticipant);
      };
      this.callOut.onnegotiationneeded = this.onnegotiationneeded;
      this.callOut.ondatachannel = this.ondatachannel;
      this.callOut.oniceconnectionstatechange = this.oniceconnectionstatechange;

      let dataChannel = this.callOut.createDataChannel("FromOubound");
      dataChannel.onerror = this.ondatachannelerror;
      dataChannel.onmessage = this.ondatachannelmessage;

      // ICE enumeration does not start until we create a local description, so call createOffer() to kick this off
      this.callOut.createOffer({ iceRestart : true} )
         .then(offer => self.callOut.setLocalDescription(offer))
         .then(() => {
            // Send our call offer data in
            var callOffer = new CallOffer(null, self.callParticipant, remoteParticipant, self.callOut.localDescription);
            axios.get('/api/offer', { params: { callOffer: callOffer } })
            .then((response) => {
               // TODO
               // Read the returned data about current status of the call
               console.log('OK onnewparticipant:');
            });
         })
         .catch(function (error) {
            // TODO - error paths 
         });
   }

   onnewoffer(remoteOffer) {
      var self = this;

      // Connect to the signalling server
      let configuration = {
         iceServers: [{ "urls": "stun:stun.1.google.com:19302" }]
      };

      this.callIn = new RTCPeerConnection(configuration);
      this.callIn.onicecandidate = (ice) => {
         self.onicecandidate(ice.candidate, remoteOffer.from);
      };
      this.callIn.onnegotiationneeded = this.onnegotiationneeded;
      this.callIn.ondatachannel = this.ondatachannel;
      this.callIn.oniceconnectionstatechange = this.oniceconnectionstatechange;

      /* let dataChannel = this.callIn.createDataChannel("FromInbound");
      dataChannel.onerror = this.ondatachannelerror;
      dataChannel.onmessage = this.ondatachannelmessage; */

      self.callIn.setRemoteDescription(new RTCSessionDescription(remoteOffer.offer))
         .then(() => self.callIn.createAnswer())
         .then(answer => self.callIn.setLocalDescription(answer))
         .then(() => {
            // Send our call answer data in
            var callAnswer = new CallAnswer(null, self.callParticipant, remoteOffer.from, self.callIn.localDescription);
            axios.get('/api/answer', { params: { callAnswer: callAnswer } })
            .then((response) => {
               // TODO
               // Read the returned data about current status of the call
               console.log('OK onnewoffer:');
            })
         })
         .catch((e) => {
            // TODO - analyse error paths
            console.log('error onnewoffer:' + JSON.stringify(e));
         });
   }

   onnewanswer(remoteAnswer) {
      var self = this;
      self.callOut.setRemoteDescription(new RTCSessionDescription(remoteAnswer.answer))
         .then(() => { console.log('OK onnewanswer');})
         .catch(e => {
            // TODO - analyse error paths
            console.log('error onnewanswer:' + JSON.stringify(e));
         });
   }

   onremoteicecandidate(remoteIceCandidate) {
      console.log('onremoteicecandidate:' + JSON.stringify(remoteIceCandidate));
      if (this.callOut)
         this.callOut.addIceCandidate(new RTCIceCandidate(remoteIceCandidate.ice));
      else
         this.callIn.addIceCandidate(new RTCIceCandidate(remoteIceCandidate.ice));
   }

   onicecandidate(candidate, to) {
      // a null candidate means ICE gathering is finished
      if (!candidate)
         return;

      var self = this;

      console.log('onicecandidate:' + JSON.stringify(candidate));
      console.log('onicecandidate:' + JSON.stringify(to));

      // Send our call ICE candidate in
      var callIceCandidate = new CallIceCandidate(null, self.callParticipant, to, candidate);
      axios.get('/api/icecandidate', { params: { callIceCandidate: callIceCandidate } })
         .then((response) => {
            // TODO
            // Read the returned data about current status of the call
            console.log('OK onicecandidate:');
         })
         .catch((e) => {
            // TODO - analyse error paths
            console.log('error onicecandidate:' + JSON.stringify(e));
         });
   }

   onnegotiationneeded () {
      var self = this;

      console.log('onnegotiationneeded');
   };

   ondatachannel(ev) {
      console.log('ondatachannel:' + JSON.stringify(ev));
   }

   ondatachannelmessage(msg) {
      console.log('ondatachannelmessage:' + JSON.stringify(msg));
   }

   ondatachannelerror(e) {
      console.log('ondatachannelerror:' + JSON.stringify(e));
   }

   oniceconnectionstatechange(ev) {
      console.log('oniceconnectionstatechange:' + JSON.stringify(ev));
   }

   componentWillUnmount() {
      // Disconnect from the signalling server ? 
   }

   render() {
      return (<div></div>);
   }
}

