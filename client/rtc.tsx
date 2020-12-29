/*! Copyright TXPCo, 2020 */
// References:
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
// https://medium.com/xamarin-webrtc/webrtc-signaling-server-dc6e38aaefba 
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation

declare var require: any

import * as React from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
 
// This app
import { Call, CallParticipation, CallOffer, CallAnswer, CallIceCandidate} from '../common/call.js';
import { TypeRegistry } from '../common/types.js';

class RtcCaller {
   // member variables
   localCallParticipation: CallParticipation;
   remoteCallParticipation: CallParticipation;
   sendConnection: RTCPeerConnection;
   sendChannel: RTCDataChannel;
   recieveChannel: RTCDataChannel;
   myCall: string;

   constructor(localCallParticipation: CallParticipation, remoteCallParticipation: CallParticipation) {
      this.localCallParticipation = localCallParticipation;
      this.remoteCallParticipation = remoteCallParticipation;
      this.sendConnection = null;
      this.sendChannel = null;
      this.recieveChannel = null;
      this.myCall = null;

      this.placeCall(localCallParticipation, remoteCallParticipation);
   }

   placeCall(localCallParticipation: CallParticipation,
      remoteCallParticipation: CallParticipation) {

      var self = this;

      // Connect to the signalling server
      let configuration = {
         iceServers: [{ "urls": "stun:stun.1.google.com:19302" }]
      };

      this.sendConnection = new RTCPeerConnection(configuration);
      this.sendConnection.onicecandidate = (ice) => {
         self.onicecandidate(ice.candidate, remoteCallParticipation, true);
      };
      this.sendConnection.onnegotiationneeded = (ev) => { self.onnegotiationneeded(ev, self) };
      this.sendConnection.ondatachannel = (ev) => { self.onrecievedatachannel(ev, self) };
      this.sendConnection.oniceconnectionstatechange = (ev) => { self.oniceconnectionstatechange(ev, self.sendConnection, true); };
      this.sendConnection.onconnectionstatechange = (ev) => { self.onconnectionstatechange(ev, self.sendConnection, self); };

      self.sendChannel = this.sendConnection.createDataChannel("FromOffer");
      self.sendChannel.onerror = this.onsendchannelerror;
      self.sendChannel.onmessage = this.onsendchannelmessage;
      self.sendChannel.onopen = (ev) => { this.onsendchannelopen(ev, self.sendChannel, self.localCallParticipation); };
      self.sendChannel.onclose = this.onsendchannelclose;
   }

   handleAnswer(answer) {
      this.sendConnection.setRemoteDescription(new RTCSessionDescription(answer))
         .then(() => { console.log('RtcCaller - OK handleAnswer call.'); })
         .catch(e => {
            // TODO - analyse error paths
            console.log('RtcCaller - error handleAnswer call' + JSON.stringify(e));
         });
   }

   handleIceCandidate(ice) {
      this.sendConnection.addIceCandidate(new RTCIceCandidate(ice));
   }

   // Override this to be notified when remote connection closes
   onremoteclose(ev) {
   }

   onicecandidate(candidate, to, outbound) {
      // a null candidate means ICE gathering is finished
      if (!candidate)
         return;

      var self = this;

      // Send our call ICE candidate in
      var callIceCandidate = new CallIceCandidate(null, self.localCallParticipation, to, candidate, outbound);
      axios.get('/api/icecandidate', { params: { callIceCandidate: callIceCandidate } })
         .then((response) => {
            // TODO
            console.log('RtcCaller - OK onicecandidate call.');
         })
         .catch((e) => {
            // TODO - analyse error paths
            console.log('RtcCaller - error onicecandidate call.' + JSON.stringify(e));
         });
   }

   onnegotiationneeded(ev, self) {

      console.log('RtcCaller::onnegotiationneeded');

      // ICE enumeration does not start until we create a local description, so call createOffer() to kick this off
      self.sendConnection.createOffer()
         .then(offer => self.sendConnection.setLocalDescription(offer))
         .then(() => {
            // Send our call offer data in
            var callOffer = new CallOffer(null, self.localCallParticipation, self.remoteCallParticipation, self.sendConnection.localDescription);
            axios.get('/api/offer', { params: { callOffer: callOffer } })
               .then((response) => {
                  // TODO
                  // Read the returned data about current status of the call
                  console.log('RtcCaller - OK onOffer call.');
               });
         })
         .catch(function (error) {
            // TODO - error paths 
            console.log('RtcCaller - error onOffer call' + JSON.stringify(error));
         });
   };

   onrecievedatachannel(ev, self) {
      console.log('RtcCaller::onrecievedatachannel:' + JSON.stringify(ev.channel));

      self.receiveChannel = ev.channel;
      self.receiveChannel.onmessage = (ev) => { self.onrecievechannelmessage(ev, self.localCallParticipation) };
      self.receiveChannel.onopen = (ev) => { self.onrecievechannelopen(ev, self.recieveChannel) };
      self.receiveChannel.onclose = self.onrecievechannelclose;
      self.receiveChannel.onerror = self.onrecievechannelerror;
   }

   oniceconnectionstatechange(ev, pc, outbound) {
      var state = pc.iceConnectionState;
      console.log('RtcCaller::oniceconnectionstatechange:' + JSON.stringify(ev) + "State:" + state);
   }

   onconnectionstatechange(ev, pc, self) {
      switch (pc.connectionState) {
         case "connected":
            // The connection has become fully connected
            break;
         case "disconnected":
         case "failed":
         case "closed":
            // The connection has been closed or failed
            self.onremoteclose (ev);
            break;
      }      
   }

   onsendchannelopen(ev, dc, localCallParticipation) {
      console.log('RtcCaller::onsendchannelopen:' + JSON.stringify(ev), " sender is " + localCallParticipation.sessionSubId);

      try {
         dc.send("Hello from " + dc.label + ", " + localCallParticipation.sessionSubId);
      }
      catch (e) {
         console.log('error ondatachannelopen:' + JSON.stringify(e));
      }
   }

   onsendchannelmessage(msg) {
      console.log('RtcCaller::ondatachannelmessage:' + JSON.stringify(msg.data));
   }

   onsendchannelerror(e) {
      console.log('RtcCaller::ondatachannelerror:' + JSON.stringify(e.error));
   }

   onsendchannelclose(ev) {
      console.log('RtcCaller::onsendchannelclose:' + JSON.stringify(ev));
   }

   onrecievechannelopen(ev, dc) {
      console.log('RtcCaller::onrecievechannelopen:' + JSON.stringify(ev));
   }

   onrecievechannelmessage(msg, localCallParticipation) {
      console.log('RtcCaller::onrecievechannelmessage:' + JSON.stringify(msg.data) + ", reciever is " + localCallParticipation.sessionSubId);
   }

   onrecievechannelerror(e) {
      console.log('RtcCaller::onrecievechannelerror:' + JSON.stringify(e.error));
   }

   onrecievechannelclose(ev) {
      console.log('RtcCaller::onrecievechannelclose:' + JSON.stringify(ev));
   }
}

class RtcReciever {
   // member variables
   localCallParticipation: CallParticipation;
   remoteCallParticipation: CallParticipation;
   recieveConnection: RTCPeerConnection;
   sendChannel: RTCDataChannel;
   recieveChannel: RTCDataChannel;
   myCall: string;

   constructor(localCallParticipation: CallParticipation, remoteOffer: CallOffer) {
      this.localCallParticipation = localCallParticipation;
      this.remoteCallParticipation = remoteOffer.from;
      this.recieveConnection = null;
      this.sendChannel = null;
      this.myCall = null;

      this.answerCall(localCallParticipation, remoteOffer);
   }

   answerCall(localCallParticipation: CallParticipation,
              remoteOffer: CallOffer) {

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
      this.recieveConnection.onconnectionstatechange = (ev) => { self.onconnectionstatechange(ev, self.recieveConnection, self); };

      self.sendChannel = this.recieveConnection.createDataChannel("FromAnswer");
      self.sendChannel.onerror = this.onsendchannelerror;
      self.sendChannel.onmessage = this.onsendchannelmessage;
      self.sendChannel.onopen = (ev) => { this.onsendchannelopen(ev, self.sendChannel, self.localCallParticipation); };
      self.sendChannel.onclose = this.onsendchannelclose;

      self.recieveConnection.setRemoteDescription(new RTCSessionDescription(remoteOffer.offer))
         .then(() => self.recieveConnection.createAnswer())
         .then(answer => self.recieveConnection.setLocalDescription(answer))
         .then(() => {
            // Send our call answer data in
            var callAnswer = new CallAnswer(null, self.localCallParticipation, remoteOffer.from, self.recieveConnection.localDescription);
            axios.get('/api/answer', { params: { callAnswer: callAnswer } })
               .then((response) => {
                  // TODO
                  // Read the returned data about current status of the call
                  console.log('RtcReciever - OK onAnswer call.');
               })
         })
         .catch((e) => {
            // TODO - analyse error paths
            console.log('RtcReciever - error onAnswer call' + JSON.stringify(e));
         });
   }

   handleIceCandidate(ice) {
      this.recieveConnection.addIceCandidate(new RTCIceCandidate(ice));
   }

   // Override this to be notified when remote connection closes
   onremoteclose(ev) {
   }

   onicecandidate(candidate, to, outbound) {
      // a null candidate means ICE gathering is finished
      if (!candidate)
         return;

      var self = this;

      // Send our call ICE candidate in
      var callIceCandidate = new CallIceCandidate(null, self.localCallParticipation, to, candidate, outbound);
      axios.get('/api/icecandidate', { params: { callIceCandidate: callIceCandidate } })
         .then((response) => {
            // TODO
            // Read the returned data about current status of the call
            console.log('RtcReciever - OK onicecandidate call.');
         })
         .catch((e) => {
            // TODO - analyse error paths
            console.log('RtcReciever - error onicecandidate call' + JSON.stringify(e));
         });
   }

   onnegotiationneeded() {
      var self = this;

      console.log('RtcReciever::onnegotiationneeded');
   };

   onrecievedatachannel(ev, self) {
      console.log('RtcReciever::onrecievedatachannel:' + JSON.stringify(ev.channel));
      self.receiveChannel = ev.channel;
      self.receiveChannel.onmessage = (ev) => { self.onrecievechannelmessage(ev, this.localCallParticipation) };
      self.receiveChannel.onopen = (ev) => { self.onrecievechannelopen(ev, self.recieveChannel) };
      self.receiveChannel.onclose = self.onrecievechannelclose;
      self.receiveChannel.onerror = self.onrecievechannelerror;
   }

   oniceconnectionstatechange(ev, pc, outbound) {
      var state = pc.iceConnectionState;
      console.log('RtcReciever::oniceconnectionstatechange:' + JSON.stringify(ev) + "State:" + state);

      if (state === "completed") {

      }
   }

   onconnectionstatechange(ev, pc, self) {
      switch (pc.connectionState) {
         case "connected":
            // The connection has become fully connected
            break;
         case "disconnected":
         case "failed":
         case "closed":
            // The connection has been closed or failed
            self.onremoteclose(ev);
            break;
      }
   }

   onsendchannelopen(ev, dc, localCallParticipation) {
      console.log('RtcReciever::onsendchannelopen:' + JSON.stringify(ev), " sender is " + localCallParticipation.sessionSubId);

      try {
         dc.send("Hello from " + dc.label + ", " + localCallParticipation.sessionSubId);
      }
      catch (e) {
         console.log('RtcReciever:: error ondatachannelopen:' + JSON.stringify(e));
      }
   }

   onsendchannelmessage(msg) {
      console.log('RtcReciever:: ondatachannelmessage:' + JSON.stringify(msg.data));
   }

   onsendchannelerror(e) {
      console.log('RtcReciever::ondatachannelerror:' + JSON.stringify(e.error));
   }

   onsendchannelclose(ev) {
      console.log('RtcReciever::onsendchannelclose:' + JSON.stringify(ev));
   }

   onrecievechannelopen(ev, dc) {
      console.log('RtcReciever::onrecievechannelopen:' + JSON.stringify(ev));
   }

   onrecievechannelmessage(msg, localCallParticipation) {
      console.log('RtcReciever::onrecievechannelmessage:' + JSON.stringify(msg.data) + ", reciever is " + localCallParticipation.sessionSubId);
   }

   onrecievechannelerror(e) {
      console.log('RtcReciever::onrecievechannelerror:' + JSON.stringify(e.error));
   }

   onrecievechannelclose(ev) {
      console.log('RtcReciever::onrecievechannelclose:' + JSON.stringify(ev));
   }
}

class RtcLink {
   // member variables
   to: CallParticipation;
   outbound: boolean;
   sender: RtcCaller;
   reciever: RtcReciever;

   constructor(to: CallParticipation, outbound: boolean, sender: RtcCaller, reciever: RtcReciever) {
      this.to = to;
      this.outbound = outbound;
      this.sender = sender;
      this.reciever = reciever;
   }
}

interface IRtcState {
}

export interface IRtcProps {
   sessionId: string;
   facilityId: string;
   personId: string;
}

export class Rtc extends React.Component<IRtcProps, IRtcState> {

   // member variables
   sender: RtcCaller;
   reciever: RtcReciever;
   localCallParticipation: CallParticipation;
   events: EventSource;
   call: Call;
   defaultCall: Call;
   links: RtcLink[];

   constructor(props: IRtcProps) {
      super(props);
      this.sender = null; 
      this.reciever = null; 
      this.call = this.defaultCall = new Call(null, null);
      this.localCallParticipation = null;
      this.links = new Array();
   }

   componentDidMount() {
   }

   getSession() {
      var self = this;
      // Create a unique id to this call participation by appending a UUID for the browser we are connecting from
      this.localCallParticipation = new CallParticipation(null, self.props.facilityId, self.props.personId, self.props.sessionId, uuidv4());

      const sourceUrl = '/callevents/?callParticipation=' + encodeURIComponent(JSON.stringify(this.localCallParticipation));
      this.events = new EventSource(sourceUrl);
      this.events.addEventListener('message', self.ongroupevents.bind(this), false);

      // Send our call participant data in
      axios.get('/api/call', { params: { callParticipation: this.localCallParticipation } })
         .then(function (response) {
            self.call = self.call.revive(response.data);
            // TODO
            // Read the returned data about current status of the call

         })
         .catch(function (error) {
            // handle error by setting state back to no user logged in
            self.call = self.defaultCall;
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
         case "CallParticipation":
            this.onParticipant(remoteCallData);
            break;
         case "CallOffer":
            this.onOffer(remoteCallData);
            break;
         case "CallAnswer":
            this.onAnswer(remoteCallData);
            break;
         case "CallIceCandidate":
            this.onRemoteIceCandidate(remoteCallData);
            break;
         default:
            console.log('Default:'+JSON.stringify(remoteCallData));
            break;
      }
   }

   onParticipant(remoteParticipation) {
      var self = this;
      var sender = new RtcCaller(self.localCallParticipation, remoteParticipation); 
      var link = new RtcLink(remoteParticipation, true, sender, null);

      // Hook so if remote closes, we close down links this side
      sender.onremoteclose = (ev) => { self.onRemoteClose(ev, sender, self); };
      this.links.push(link);
   }

   onOffer(remoteOffer) {
      var self = this;
      var reciever = new RtcReciever(self.localCallParticipation, remoteOffer); 
      var link = new RtcLink(remoteOffer.to, false, null, reciever);

      // Hook so if remote closes, we close down links this side
      reciever.onremoteclose = (ev) => { self.onRemoteClose(ev, reciever, self); };

      this.links.push(link);
   }

   onAnswer(remoteAnswer) {
      var self = this;
      for (var i = 0; i < self.links.length; i++) {
         if (self.links[i].to.equals (remoteAnswer.from))
            self.links[i].sender.handleAnswer(remoteAnswer.answer);
      }
   }

   onRemoteIceCandidate(remoteIceCandidate) {
      var self = this;

      for (var i = 0; i < self.links.length; i++) {
         if (self.links[i].to.equals(remoteIceCandidate.from)) {
            if (remoteIceCandidate.outbound)
               self.links[i].reciever.handleIceCandidate(remoteIceCandidate.ice);
            else
               self.links[i].sender.handleIceCandidate(remoteIceCandidate.ice);
         }
      }
   }

   onRemoteClose(ev, rtc, self) {
      for (var i = 0; i < self.links.length; i++) {
         if (self.links[i].to.equals(rtc.remoteCallParticipation)) {
            self.links.splice(i, 1);
            break;
         }
      }
   }

   componentWillUnmount() {
      // Disconnect from the signalling server ? 
   }

   render() {
      return (<div></div>);
   }
}

