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
   localCallParticipant: CallParticipant;
   sendConnection: RTCPeerConnection;
   recieveConnection: RTCPeerConnection;
   sendChannel: RTCDataChannel;
   recieveChannel: RTCDataChannel;
   events: EventSource;
   call: Call;
   defaultCall: Call;

   constructor(props: IRtcProps) {
      super(props);
      this.sendConnection = null;
      this.recieveConnection = null;
      this.sendChannel = null;
      this.recieveChannel = null;
   }

   componentDidMount() {
      var self = this;

      this.call = this.defaultCall = new Call(null, null);
      this.localCallParticipant = null;
   }

   getSession() {
      var self = this;
      this.localCallParticipant = new CallParticipant(null, self.props.facilityId, self.props.personId, uuidv4());
      const sourceUrl = '/callevents/?callParticipant=' + encodeURIComponent(JSON.stringify(this.localCallParticipant));
      this.events = new EventSource(sourceUrl);
      this.events.addEventListener('message', self.ongroupevents.bind(this), false);

      // Send our call participant data in
      axios.get('/api/call', { params: { callParticipant: this.localCallParticipant } })
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
            this.onnewparticipant(remoteCallData);
            break;
         case "CallOffer":
            this.onnewoffer(remoteCallData);
            break;
         case "CallAnswer":
            this.onnewanswer(remoteCallData);
            break;
         case "CallIceCandidate":
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

      this.sendConnection = new RTCPeerConnection(configuration);
      this.sendConnection.onicecandidate = (ice) => {
         self.onicecandidate(ice.candidate, remoteParticipant, true);
      };
      this.sendConnection.onnegotiationneeded = this.onnegotiationneeded;
      this.sendConnection.ondatachannel = (ev) => { self.onrecievedatachannel(ev, self) };
      this.sendConnection.oniceconnectionstatechange = (ev) => { self.oniceconnectionstatechange(ev, self.sendConnection, true); };

      self.sendChannel = this.sendConnection.createDataChannel("FromOffer");
      self.sendChannel.onerror = this.onsendchannelerror;
      self.sendChannel.onmessage = this.onsendchannelmessage;
      self.sendChannel.onopen = (ev) => { this.onsendchannelopen(ev, self.sendChannel); };
      self.sendChannel.onclose = this.onsendchannelclose;

      // ICE enumeration does not start until we create a local description, so call createOffer() to kick this off
      this.sendConnection.createOffer({ iceRestart : true} )
         .then(offer => self.sendConnection.setLocalDescription(offer))
         .then(() => {
            // Send our call offer data in
            var callOffer = new CallOffer(null, self.localCallParticipant, remoteParticipant, self.sendConnection.localDescription);
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

      this.recieveConnection = new RTCPeerConnection(configuration);
      this.recieveConnection.onicecandidate = (ice) => {
         self.onicecandidate(ice.candidate, remoteOffer.from, false);
      };
      this.recieveConnection.onnegotiationneeded = this.onnegotiationneeded;
      this.recieveConnection.ondatachannel = (ev) => { self.onrecievedatachannel(ev, self) };
      this.recieveConnection.oniceconnectionstatechange = (ev) => { self.oniceconnectionstatechange(ev, self.recieveConnection, false); };

      self.sendChannel = this.recieveConnection.createDataChannel("FromAnswer");
      self.sendChannel.onerror = this.onsendchannelerror;
      self.sendChannel.onmessage = this.onsendchannelmessage;
      self.sendChannel.onopen = (ev) => { this.onsendchannelopen(ev, self.sendChannel); };
      self.sendChannel.onclose = this.onsendchannelclose;

      self.recieveConnection.setRemoteDescription(new RTCSessionDescription(remoteOffer.offer))
         .then(() => self.recieveConnection.createAnswer())
         .then(answer => self.recieveConnection.setLocalDescription(answer))
         .then(() => {
            // Send our call answer data in
            var callAnswer = new CallAnswer(null, self.localCallParticipant, remoteOffer.from, self.recieveConnection.localDescription);
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
      self.sendConnection.setRemoteDescription(new RTCSessionDescription(remoteAnswer.answer))
         .then(() => { console.log('OK onnewanswer');})
         .catch(e => {
            // TODO - analyse error paths
            console.log('error onnewanswer:' + JSON.stringify(e));
         });
   }

   onremoteicecandidate(remoteIceCandidate) {
      if (remoteIceCandidate.outbound)
         this.recieveConnection.addIceCandidate(new RTCIceCandidate(remoteIceCandidate.ice));
      else
         this.sendConnection.addIceCandidate(new RTCIceCandidate(remoteIceCandidate.ice));
   }

   onicecandidate(candidate, to, outbound) {
      // a null candidate means ICE gathering is finished
      if (!candidate)
         return;

      var self = this;

      // Send our call ICE candidate in
      var callIceCandidate = new CallIceCandidate(null, self.localCallParticipant, to, candidate, outbound);
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

   onrecievedatachannel(ev, self) {
      console.log('onrecievedatachannel:' + JSON.stringify(ev.channel));
      self.receiveChannel = ev.channel;
      self.receiveChannel.onmessage = self.onrecievechannelmessage;
      self.receiveChannel.onopen = (ev) => { self.onrecievechannelopen(ev, self.recieveChannel) };
      self.receiveChannel.onclose = self.onrecievechannelclose;
      self.receiveChannel.onerror = self.onrecievechannelerror;
   }

   oniceconnectionstatechange(ev, pc, outbound) {
      var state = pc.iceConnectionState;
      console.log('oniceconnectionstatechange:' + JSON.stringify(ev) + "State:" + state);

      if (state === "completed" ) {

      }
   }

   onsendchannelopen(ev, dc) {
      console.log('onsendchannelopen:' + JSON.stringify(ev));

      try {
         dc.send("Hello from outbound. " + dc.label);
      }
      catch (e) {
         console.log('error ondatachannelopen:' + JSON.stringify(e));
      }   
   }

   onsendchannelmessage(msg) {
      console.log('ondatachannelmessage:' + JSON.stringify(msg.data));
   }

   onsendchannelerror(e) {
      console.log('ondatachannelerror:' + JSON.stringify(e.error));
   }

   onsendchannelclose(ev) {
      console.log('onsendchannelclose:' + JSON.stringify(ev));
   }

   onrecievechannelopen(ev, dc) {
      console.log('onrecievechannelopen:' + JSON.stringify(ev));
   }

   onrecievechannelmessage(msg) {
      console.log('onrecievechannelmessage:' + JSON.stringify(msg.data));
   }

   onrecievechannelerror(e) {
      console.log('onrecievechannelerror:' + JSON.stringify(e.error));
   }

   onrecievechannelclose(ev) {
      console.log('onrecievechannelclose:' + JSON.stringify(ev));
   }

   componentWillUnmount() {
      // Disconnect from the signalling server ? 
   }

   render() {
      return (<div></div>);
   }
}

