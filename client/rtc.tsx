/*! Copyright TXPCo, 2020 */
// References:
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
// https://medium.com/xamarin-webrtc/webrtc-signaling-server-dc6e38aaefba 
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation

declare var require: any

import * as React from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import adapter from 'webrtc-adapter'; // Google shim library
 
// This app
import { Call, CallParticipation, CallOffer, CallAnswer, CallIceCandidate} from '../common/call.js';
import { TypeRegistry } from '../common/types.js';
import { Logger } from './logger'

var logger = new Logger();

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
   }

   placeCall() {

      var self = this;

      // Connect to the signalling server
      let configuration = {
         iceServers: [{ "urls": "stun:stun.1.google.com:19302" }]
      };

      this.sendConnection = new RTCPeerConnection(configuration);
      this.sendConnection.onicecandidate = (ice) => {
         self.onicecandidate(ice.candidate, self.remoteCallParticipation, true);
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
         .then(() => {
            logger.info('RtcCaller', 'handleAnswer', 'succeeded', null);

            // TODO
            // Read returned data about current status of the call
         })
         .catch(e => {
            // TODO - analyse error paths
            logger.error ('RtcCaller',  'handleAnswer', 'error:', e);
         });
   }

   handleIceCandidate(ice) {
      this.sendConnection.addIceCandidate(new RTCIceCandidate(ice))
         .catch(e => {
            // TODO - analyse error paths
            logger.error('RtcCaller', 'handleIceCandidate', 'error:', e);
         });;
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
            logger.info ('RtcCaller', 'onicecandidate', 'OK', null);
         })
         .catch((e) => {
            // TODO - analyse error paths
            logger.error ('RtcCaller', 'onicecandidate', 'error:', e);
         });
   }

   onnegotiationneeded(ev, self) {

      logger.info('RtcCaller', 'onnegotiationneeded', null, null);

      // ICE enumeration does not start until we create a local description, so call createOffer() to kick this off
      self.sendConnection.createOffer()
         .then(offer => self.sendConnection.setLocalDescription(offer))
         .then(() => {
            // Send our call offer data in
            var callOffer = new CallOffer(null, self.localCallParticipation, self.remoteCallParticipation, self.sendConnection.localDescription);
            axios.get('/api/offer', { params: { callOffer: callOffer } })
               .then((response) => {
                  logger.info('RtcCaller', 'createOffer', "Call succeeded", null);
               });
         })
         .catch(function (error) {
            // TODO - analyse error paths 
            logger.error ('RtcCaller', 'createOffer', 'error', error);
         });
   };

   onrecievedatachannel(ev, self) {
      logger.info('RtcCaller', 'onrecievedatachannel', "channel:", ev.channel);

      self.receiveChannel = ev.channel;
      self.receiveChannel.onmessage = (ev) => { self.onrecievechannelmessage(ev, self.localCallParticipation) };
      self.receiveChannel.onopen = (ev) => { self.onrecievechannelopen(ev, self.recieveChannel) };
      self.receiveChannel.onclose = self.onrecievechannelclose;
      self.receiveChannel.onerror = self.onrecievechannelerror;
   }

   oniceconnectionstatechange(ev, pc, outbound) {
      var state = pc.iceConnectionState;
      logger.info('RtcCaller', 'oniceconnectionstatechange', "state:", state);
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
      logger.info('RtcCaller', 'onsendchannelopen', "sender is:", localCallParticipation.sessionSubId);

      try {
         dc.send("Hello from " + dc.label + ", " + localCallParticipation.sessionSubId);
      }
      catch (e) {
         logger.error('RtcCaller', 'onsendchannelopen', "error:", e);
      }
   }

   onsendchannelmessage(msg) {
      logger.info('RtcCaller', 'onsendchannelmessage', "message:", msg.data);
   }

   onsendchannelerror(e) {
      logger.error('RtcCaller', 'onsendchannelerror', "error:", e.error);
   }

   onsendchannelclose(ev) {
      logger.info('RtcCaller', 'onsendchannelmessage', "event:", ev);
   }

   onrecievechannelopen(ev, dc) {
      logger.info('RtcCaller', 'onrecievechannelopen', "event:", ev);
   }

   onrecievechannelmessage(msg, localCallParticipation) {
      logger.info('RtcCaller', 'onrecievechannelmessage', "message:", msg.data);
   }

   onrecievechannelerror(e) {
      logger.error('RtcCaller', 'onrecievechannelerror', "error:", e);
   }

   onrecievechannelclose(ev) {
      logger.info('RtcCaller', 'onrecievechannelclose', "event:", ev);
   }
}

class RtcReciever {
   // member variables
   localCallParticipation: CallParticipation;
   remoteCallParticipation: CallParticipation;
   remoteOffer: CallOffer;
   recieveConnection: RTCPeerConnection;
   sendChannel: RTCDataChannel;
   recieveChannel: RTCDataChannel;
   myCall: string;

   constructor(localCallParticipation: CallParticipation, remoteOffer: CallOffer) {
      this.localCallParticipation = localCallParticipation;
      this.remoteCallParticipation = remoteOffer.from;
      this.remoteOffer = remoteOffer;
      this.recieveConnection = null;
      this.sendChannel = null;
      this.myCall = null;
   }

   answerCall() {

      var self = this;
      // Connect to the signalling server
      let configuration = {
         iceServers: [{ "urls": "stun:stun.1.google.com:19302" }]
      };

      this.recieveConnection = new RTCPeerConnection(configuration);
      this.recieveConnection.onicecandidate = (ice) => {
         self.onicecandidate(ice.candidate, self.remoteOffer.from, false);
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

      self.recieveConnection.setRemoteDescription(new RTCSessionDescription(self.remoteOffer.offer))
         .then(() => self.recieveConnection.createAnswer())
         .then(answer => self.recieveConnection.setLocalDescription(answer))
         .then(() => {
            // Send our call answer data in
            var callAnswer = new CallAnswer(null, self.localCallParticipation, self.remoteOffer.from, self.recieveConnection.localDescription);
            axios.get('/api/answer', { params: { callAnswer: callAnswer } })
               .then((response) => {
                  // TODO
                  // Read the returned data about current status of the call
                  logger.info('RtcReciever', 'answerCall', '', null);
               })
         })
         .catch((e) => {
            // TODO - analyse error paths
            logger.error('RtcReciever', 'answerCall', "error:", e);
         });
   }

   handleIceCandidate(ice) {
      this.recieveConnection.addIceCandidate(new RTCIceCandidate(ice))
         .catch(e => {
            // TODO - analyse error paths
            logger.error('RtcReciever', 'handleIceCandidate', "error:", e);
         });;
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
            logger.info ('RtcReciever', 'onicecandidate', '', null);
         })
         .catch((e) => {
            // TODO - analyse error paths
            logger.error('RtcReciever', 'onicecandidate', "error:", e);
         });
   }

   onnegotiationneeded() {
      var self = this;

      logger.info('RtcReciever', 'onnegotiationneeded', '', null);
   };

   onrecievedatachannel(ev, self) {
      logger.info('RtcReciever', 'onrecievedatachannel', '', null);
      self.receiveChannel = ev.channel;
      self.receiveChannel.onmessage = (ev) => { self.onrecievechannelmessage(ev, self.localCallParticipation) };
      self.receiveChannel.onopen = (ev) => { self.onrecievechannelopen(ev, self.recieveChannel) };
      self.receiveChannel.onclose = self.onrecievechannelclose;
      self.receiveChannel.onerror = self.onrecievechannelerror;
   }

   oniceconnectionstatechange(ev, pc, outbound) {
      var state = pc.iceConnectionState;
      logger.info('RtcReciever', 'oniceconnectionstatechange', 'state:', state);
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
      logger.info('RtcReciever', 'onsendchannelopen', 'sender session is:', localCallParticipation.sessionSubId);

      try {
         dc.send("Hello from " + dc.label + ", " + localCallParticipation.sessionSubId);
      }
      catch (e) {
         logger.error('RtcReciever', 'onsendchannelopen', "error:", e);
      }
   }

   onsendchannelmessage(msg) {
      logger.info('RtcReciever', 'ondatachannelmessage', 'message:', msg.data);
   }

   onsendchannelerror(e) {
      logger.error('RtcReciever', 'onsendchannelerror', "error:", e.error);
   }

   onsendchannelclose(ev) {
      logger.info('RtcReciever', 'onsendchannelclose', 'event:', ev);
   }

   onrecievechannelopen(ev, dc) {
      logger.info('RtcReciever', 'onrecievechannelopen', 'event:', ev);
   }

   onrecievechannelmessage(msg, localCallParticipation) {
      logger.info('RtcReciever', 'onrecievechannelmessage', 'message:', msg.data);
   }

   onrecievechannelerror(e) {
      logger.error('RtcReciever', 'onrecievechannelerror', "error:", e.error);
   }

   onrecievechannelclose(ev) {
      logger.info('RtcReciever', 'onrecievechannelclose', 'event:', ev);
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
            logger.info('RtcReciever', 'ongroupevents', "data:", remoteCallData);
            break;
      }
   }

   onParticipant(remoteParticipation) {
      var self = this;
      var sender = new RtcCaller(self.localCallParticipation, remoteParticipation); 
      var link = new RtcLink(remoteParticipation, true, sender, null);

      // Hook so if remote closes, we close down links this side
      sender.onremoteclose = (ev) => { self.onRemoteClose(ev, sender, self); };
      self.links.push(link);

      // place the call after setting up 'links' to avoid a race condition
      sender.placeCall();
   }

   onOffer(remoteOffer) {
      var self = this;
      var reciever = new RtcReciever(self.localCallParticipation, remoteOffer); 
      var link = new RtcLink(remoteOffer.from, false, null, reciever);

      // Hook so if remote closes, we close down links this side
      reciever.onremoteclose = (ev) => { self.onRemoteClose(ev, reciever, self); };
      self.links.push(link);

      // answer the call after setting up 'links' to avoid a race condition
      reciever.answerCall();
   }

   onAnswer(remoteAnswer) {
      var self = this;
      var found = false;

      for (var i = 0; i < self.links.length; i++) {
         if (self.links[i].to.equals(remoteAnswer.from)) {
            self.links[i].sender.handleAnswer(remoteAnswer.answer);
            found = true;
            break;
         }
      }
      if (!found)
         logger.error('RtcLink', 'onAnswer', "cannot find target:", remoteAnswer);
   }

   onRemoteIceCandidate(remoteIceCandidate) {
      var self = this;
      var found = false;

      for (var i = 0; i < self.links.length; i++) {
         if (self.links[i].to.equals(remoteIceCandidate.from)) {
            if (remoteIceCandidate.outbound)
               self.links[i].reciever.handleIceCandidate(remoteIceCandidate.ice);
            else
               self.links[i].sender.handleIceCandidate(remoteIceCandidate.ice);
            found = true;
            break;
         }
      }
      if (!found)
         logger.error('RtcLink', 'onRemoteIceCandidate', "cannot find target:", remoteIceCandidate);
   }

   onRemoteClose(ev, rtc, self) {
      var found = false;

      for (var i = 0; i < self.links.length; i++) {
         if (self.links[i].to.equals(rtc.remoteCallParticipation)) {
            self.links.splice(i, 1);
            found = true;
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

