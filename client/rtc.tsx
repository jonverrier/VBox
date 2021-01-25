/*! Copyright TXPCo, 2020 */
// References:
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
// https://medium.com/xamarin-webrtc/webrtc-signaling-server-dc6e38aaefba 
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation
//
// TODO - all classes in this file have a weak implementation of event firing / callback functions, which is that 
// functions are directly overwritten, so only one 'listener' per event.
// Multiple listeners will silently override each other. 

declare var require: any

import * as React from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import adapter from 'webrtc-adapter'; // Google shim library
 
// This app
import { Person } from '../common/person.js';
import { CallParticipation, CallOffer, CallAnswer, CallIceCandidate} from '../common/call.js';
import { TypeRegistry } from '../common/types.js';
import { FourStateRagEnum } from '../common/enum.js';
import { Logger } from './logger';


var logger = new Logger();

class RtcCaller {
   // member variables
   localCallParticipation: CallParticipation;
   remoteCallParticipation: CallParticipation;
   person: Person;
   sendConnection: RTCPeerConnection;
   sendChannel: RTCDataChannel;
   recieveChannel: RTCDataChannel;
   connected: boolean;

   constructor(localCallParticipation: CallParticipation, remoteCallParticipation: CallParticipation, person: Person) {
      this.localCallParticipation = localCallParticipation;
      this.remoteCallParticipation = remoteCallParticipation;
      this.person = person;
      this.sendConnection = null;
      this.sendChannel = null;
      this.recieveChannel = null;
      this.connected = false;
   }

   // Override these for notifications - TODO - see top of file
   onremoteclose: ((this: RtcCaller, ev: Event) => any) | null;
   onremoteissues: ((this: RtcCaller, ev: Event) => any) | null;
   onremoteconnection: ((this: RtcCaller, ev: Event) => any) | null;
   onremoteperson: ((this: RtcCaller, ev: Event) => any) | null;
   onremotedata: ((this: RtcCaller, ev: Event) => any) | null;

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
      this.sendConnection.onicecandidateerror = (ev) => { self.onicecandidateerror(ev, self); };

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

   onicecandidate(candidate, to, outbound) {
      // a null candidate means ICE gathering is finished
      if (!candidate)
         return;

      var self = this;

      // Send our call ICE candidate in
      var callIceCandidate = new CallIceCandidate(null, self.localCallParticipation, to, candidate, outbound);
      axios.post ('/api/icecandidate', { params: { callIceCandidate: callIceCandidate } })
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
            axios.post ('/api/offer', { params: { callOffer: callOffer } })
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
            self.connected = true;

            // The connection has become fully connected
            if (self.onremoteconnection)
               self.onremoteconnection (ev);
            break;
         case "disconnected":
            // Something going on ... 
            if (self.onremoteissues)
               self.onremoteissues(ev);
            break;
         case "failed":
         case "closed":
            // The connection has been closed or failed
            self.connected = false;
            if (self.onremoteclose)
               self.onremoteclose(ev);
            break;
      }
   }

   onicecandidateerror(ev, self) {
      logger.error('RtcReciever', 'onicecandidateerror', 'event:', ev);
   }

   onsendchannelopen(ev, dc, localCallParticipation) {
      logger.info('RtcCaller', 'onsendchannelopen', "sender is:", localCallParticipation.sessionSubId);

      try {
         dc.send(JSON.stringify (this.person));
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

      var types = new TypeRegistry();
      var remoteCallData = types.reviveFromJSON(msg.data);

      if (remoteCallData.__type === Person.prototype.__type && this.onremoteperson) {
         this.onremoteperson(remoteCallData);
      }

      if (this.onremotedata) {
         this.onremotedata(remoteCallData);
      }
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
   person: Person;
   remoteOffer: CallOffer;
   recieveConnection: RTCPeerConnection;
   sendChannel: RTCDataChannel;
   recieveChannel: RTCDataChannel;
   connected: boolean;

   constructor(localCallParticipation: CallParticipation, remoteOffer: CallOffer, person: Person) {
      this.localCallParticipation = localCallParticipation;
      this.remoteCallParticipation = remoteOffer.from;
      this.person = person;
      this.remoteOffer = remoteOffer;
      this.recieveConnection = null;
      this.sendChannel = null;
      this.connected = false;
   }

   // Override these for notifications  - TODO - see top of file
   onremoteclose: ((this: RtcReciever, ev: Event) => any) | null;
   onremoteissues: ((this: RtcReciever, ev: Event) => any) | null;
   onremoteconnection: ((this: RtcReciever, ev: Event) => any) | null;
   onremoteperson: ((this: RtcReciever, ev: Event) => any) | null;
   onremotedata: ((this: RtcReciever, ev: Event) => any) | null;

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
      this.recieveConnection.onicecandidateerror = (ev) => { self.onicecandidateerror(ev, self); };

      self.sendChannel = this.recieveConnection.createDataChannel("FromAnswer");
      self.sendChannel.onerror = this.onsendchannelerror;
      self.sendChannel.onmessage = this.onsendchannelmessage;
      self.sendChannel.onopen = (ev) => { this.onsendchannelopen(ev, self.sendChannel, self.localCallParticipation); };
      self.sendChannel.onclose = this.onsendchannelclose;

      self.recieveConnection.setRemoteDescription(new RTCSessionDescription(self.remoteOffer.offer))
         .then(() => self.recieveConnection.createAnswer())
         .then((answer) => self.recieveConnection.setLocalDescription(answer))
         .then(() => {
            // Send our call answer data in
            var callAnswer = new CallAnswer(null, self.localCallParticipation, self.remoteOffer.from, self.recieveConnection.localDescription);
            axios.post ('/api/answer', { params: { callAnswer: callAnswer } })
               .then((response) => {
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

   onicecandidate(candidate, to, outbound) {
      // a null candidate means ICE gathering is finished
      if (!candidate)
         return;

      var self = this;

      // Send our call ICE candidate in
      var callIceCandidate = new CallIceCandidate(null, self.localCallParticipation, to, candidate, outbound);
      axios.post ('/api/icecandidate', { params: { callIceCandidate: callIceCandidate } })
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
            self.connected = true;

            // The connection has become fully connected
            if (self.onremoteconnection)
               self.onremoteconnection(ev);
            break;
         case "disconnected":
            // Something going on ... 
            if (self.onremoteissues)
               self.onremoteissues(ev);
            break;
         case "failed":
         case "closed":
            // The connection has been closed or failed
            self.connected = false;
            if (self.onremoteclose)
               self.onremoteclose(ev);
            break;
      }
   }

   onicecandidateerror(ev, self) {
      logger.error('RtcReciever', 'onicecandidateerror', 'event:', ev);
   }

   onsendchannelopen(ev, dc, localCallParticipation) {
      logger.info('RtcReciever', 'onsendchannelopen', 'sender session is:', localCallParticipation.sessionSubId);

      try {
         dc.send(JSON.stringify(this.person));
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

      var types = new TypeRegistry();
      var remoteCallData = types.reviveFromJSON(msg.data);

      if (remoteCallData.__type === Person.prototype.__type && this.onremoteperson) {
         this.onremoteperson(remoteCallData);
      }

      if (this.onremotedata) {
         this.onremotedata(remoteCallData);
      }
   }

   onrecievechannelerror(e) {
      logger.error('RtcReciever', 'onrecievechannelerror', "error:", e.error);
   }

   onrecievechannelclose(ev) {
      logger.info('RtcReciever', 'onrecievechannelclose', 'event:', ev);
   }
}

export class RtcLink {
   // member variables
   to: CallParticipation;
   outbound: boolean;
   sender: RtcCaller;
   reciever: RtcReciever;
   linkStatus: FourStateRagEnum;

   constructor(to: CallParticipation, outbound: boolean, sender: RtcCaller, reciever: RtcReciever) {
      this.to = to;
      this.outbound = outbound;
      this.sender = sender;
      this.reciever = reciever;
      this.linkStatus = FourStateRagEnum.Indeterminate;

      if (reciever) {
         reciever.onremoteclose = this.onremoterecieverclose.bind(this);
         reciever.onremoteissues = this.onremoterecieverissues.bind(this);
         reciever.onremoteconnection = this.onremoterecieverconnection.bind(this);
         reciever.onremoteperson = this.onremoteperson.bind(this);
         reciever.onremotedata = this.onremotedata.bind(this);
      }
      if (sender) {
         sender.onremoteclose = this.onremotesenderclose.bind(this);
         sender.onremoteissues = this.onremotesenderissues.bind(this);
         sender.onremoteconnection = this.onremotesenderconnection.bind(this);
      }
   }

   // Override these for notifications  - TODO - see top of file
   onlinkstatechange: ((this: RtcLink, ev: Event) => any) | null;

   status() {
      return this.linkStatus;
   }

   toName() {
   }

   onremoterecieverclose(ev) {
      this.linkStatus = FourStateRagEnum.Red;
      if (this.onlinkstatechange)
         this.onlinkstatechange(this.linkStatus);
   }

   onremoterecieverissues(ev) {
      this.linkStatus = FourStateRagEnum.Amber;
      if (this.onlinkstatechange)
         this.onlinkstatechange(this.linkStatus);
   }

   onremoterecieverconnection(ev) {
      this.linkStatus = FourStateRagEnum.Green;
      if (this.onlinkstatechange)
         this.onlinkstatechange(this.linkStatus);
   }

   onremoteperson(ev) {
      if (this.onremoteperson)
         this.onremoteperson(ev);
   }

   onremotedata(ev) {
      if (this.onremotedata)
         this.onremotedata(ev);
   }

   onremotesenderclose(ev) {
      this.linkStatus = FourStateRagEnum.Red;
      if (this.onlinkstatechange)
         this.onlinkstatechange(this.linkStatus);
   }

   onremotesenderissues(ev) {
      this.linkStatus = FourStateRagEnum.Amber;
      if (this.onlinkstatechange)
         this.onlinkstatechange(this.linkStatus);
   }

   onremotesenderconnection(ev) {
      this.linkStatus = FourStateRagEnum.Green;
      if (this.onlinkstatechange)
         this.onlinkstatechange(this.linkStatus);
   }
}

export interface IRtcProps {
   facilityId: string;
   sessionId: string;
   personId: string;
   personName: string;
   personThumbnailUrl: string;
}

export class Rtc {

   // member variables
   localCallParticipation: CallParticipation;
   person: Person;
   events: EventSource;
   links: RtcLink[];
   lastSequenceNo: number;
   serverStatus: FourStateRagEnum;
   retries: number;

   constructor(props: IRtcProps) {
      this.localCallParticipation = null;
      this.links = new Array();
      this.lastSequenceNo = 0;

      // Create a unique id to this call participation by appending a UUID for the browser tab we are connecting from
      this.localCallParticipation = new CallParticipation(null, props.facilityId, props.personId, props.sessionId, uuidv4());

      // Store data on the Person who is running the app - used in data handshake & exchange
      this.person = new Person(null, props.personId, props.personName, null, props.personThumbnailUrl, null);

      this.retries = 0;
      this.serverStatus = FourStateRagEnum.Indeterminate;

      if (this.onserverconnectionstatechange)
         this.onserverconnectionstatechange(this.serverStatus);

      // This is a deliberate no-op - just allows easier debugging by having a variable to hover over. 
      logger.info("Rtc", 'constructor', 'Browser:', adapter.browserDetails);
   }

   // Override these for notifications  - TODO - see top of file
   onserverconnectionstatechange: ((this: Rtc, ev: Event) => any) | null;
   onlinkstatechange: ((this: Rtc, ev: Event, link: RtcLink) => any) | null;
   onremoteperson: ((this: Rtc, ev: Person, link: RtcLink) => any) | null;
   onremotedata: ((this: Rtc, ev: Event, link: RtcLink) => any) | null;

   connectFirst() {
      this.connect();
   }

   connect() {
      logger.info('RtcReciever', 'connect', "", null);

      var self = this;

      // Send our own details & subscribe to more
      const sourceUrl = '/callevents/?callParticipation='
         + encodeURIComponent(JSON.stringify(this.localCallParticipation))
         + '&sequenceNo=' + encodeURIComponent(JSON.stringify(this.lastSequenceNo));
      self.events = new EventSource(sourceUrl);
      self.events.onmessage = self.onServerEvent.bind(self);
      self.events.onerror = self.onServerError.bind(self);
   }

   sleep(time) {
      return new Promise(resolve => setTimeout(resolve, time));
   }

   async connectLater (time) {
      await this.sleep(time);
      this.connect();
   }

   status () {
      return this.serverStatus;
   }

   onServerEvent(ev) {

      this.retries = 0;

      // RAG status checking and notification
      if (this.serverStatus !== FourStateRagEnum.Green) {
         this.serverStatus = FourStateRagEnum.Green;
         if (this.onserverconnectionstatechange)
            this.onserverconnectionstatechange(this.serverStatus);
      }

      var types = new TypeRegistry();
      var remoteCallData = types.reviveFromJSON(ev.data);
      var payload = remoteCallData.data;

      switch (payload.__type) {
         case "CallParticipation":
            this.onParticipant(payload);
            break;
         case "CallOffer":
            this.onOffer(payload);
            break;
         case "CallAnswer":
            this.onAnswer(payload);
            break;
         case "CallIceCandidate":
            this.onRemoteIceCandidate(payload);
            break;
         default:
            logger.info('RtcReciever', 'onServerEvent', "data:", payload);
            break;
      }

      this.lastSequenceNo = remoteCallData.sequenceNo;
   }

   onServerError(ev) {
      var self = this;

      logger.info('RtcReciever', 'onServerError', "event:", ev);
      self.events.close();
      self.connectLater(5000);
      self.retries++;

      if (self.retries > 3) {
         // RAG status checking and notification
         if (this.serverStatus !== FourStateRagEnum.Red) {
            this.serverStatus = FourStateRagEnum.Red;
            if (this.onserverconnectionstatechange)
               this.onserverconnectionstatechange(this.serverStatus);
         }
      } else {
         // RAG status checking and notification
         if (this.serverStatus !== FourStateRagEnum.Amber) {
            this.serverStatus = FourStateRagEnum.Amber;
            if (this.onserverconnectionstatechange)
               this.onserverconnectionstatechange(this.serverStatus);
         }
      }
   }

   onParticipant(remoteParticipation) {
      var self = this;

      var sender = new RtcCaller(self.localCallParticipation, remoteParticipation, self.person); 
      var link = new RtcLink(remoteParticipation, true, sender, null);

      // Hook to pass up link status changes. 
      link.onlinkstatechange = (ev) => { if (self.onlinkstatechange) self.onlinkstatechange(ev, link); };

      // Hooks to pass up data
      sender.onremoteperson = (ev) => { if (self.onremoteperson) self.onremoteperson(ev, link); };
      sender.onremotedata = (ev) => { if (self.onremotedata) self.onremotedata(ev, link); };

      // Hook so if remote closes, we close down links this side
      sender.onremoteclose = (ev) => { self.onRemoteClose(ev, sender, self); };

      self.links.push(link);

      // Notify parent of link status change
      if (this.onlinkstatechange)
         this.onlinkstatechange(link.linkStatus, link);

      // place the call after setting up 'links' to avoid a race condition
      sender.placeCall();
   }

   onOffer(remoteOffer) {
      var self = this;

      for (var i = 0; i < self.links.length; i++) {
         if (self.links[i].to.equals(remoteOffer.from)) {
            // If the server restarts, other clients will try to reconect, resulting race conditions for the offer 
            // The recipient with the greater glareResolve makes the winning offer 
            if (self.localCallParticipation.glareResolve < remoteOffer.from.glareResolve) {
               self.links.splice(i); // if we lose the glareResolve test, kill the existing call & answer theirs
            } else {
               return;               // if we win, they will answer our offer, we do nothing more 
            }
         }
      }

      var reciever = new RtcReciever(self.localCallParticipation, remoteOffer, self.person); 
      var link = new RtcLink(remoteOffer.from, false, null, reciever);

      // Hook to pass up link status changes. 
      link.onlinkstatechange = (ev) => { if (self.onlinkstatechange) self.onlinkstatechange(ev, link); };

      // Hooks to pass up data
      reciever.onremoteperson = (ev) => { if (self.onremoteperson) self.onremoteperson(ev, link); };
      reciever.onremotedata = (ev) => { if (self.onremotedata) self.onremotedata(ev, link); };

      // Hook so if remote closes, we close down links this side
      reciever.onremoteclose = (ev) => { self.onRemoteClose(ev, reciever, self); };
      self.links.push(link);

      // Notify parent of link status change
      if (this.onlinkstatechange)
         this.onlinkstatechange(link.linkStatus, link);

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

            // Notify parent of link status change
            if (this.onlinkstatechange)
               this.onlinkstatechange(self.links[i].linkStatus, self.links[i]);
            break;
         }
      }
      if (!found)
         logger.error('RtcLink', 'onAnswer', "cannot find target:", remoteAnswer);
   }

   onRemoteIceCandidate(remoteIceCandidate) {
      var self = this;
      var found = false;

      // Ice candidate messages can be sent while we are still resolving glare - e.g. we are calling each other, and we killed our side while we have
      // incoming messages still pending
      // So fail silently if we get unexpected Ice candidate messages 
      for (var i = 0; i < self.links.length; i++) {
         if (self.links[i].to.equals(remoteIceCandidate.from)) {
            if (remoteIceCandidate.outbound) {
               // second test for connection avoids sending ice candidates that raise an error - to simplify debugging
               if (self.links[i].reciever && !self.links[i].reciever.connected) 
                  self.links[i].reciever.handleIceCandidate(remoteIceCandidate.ice);
               // else silent fail
            } else {
               // second test for connection avoids sending ice candidates that raise an error - to simplify debugging
               if (self.links[i].sender && !self.links[i].sender.connected)
                  self.links[i].sender.handleIceCandidate(remoteIceCandidate.ice);
               // else silent fail
            }
            found = true;
            break;
         }
      }
      if (!found)
         logger.error('RtcLink', 'onRemoteIceCandidate', "cannot find target:", remoteIceCandidate);
   }

   onRemoteClose(ev, rtclink, self) {
      var found = false;

      for (var i = 0; i < self.links.length; i++) {
         if (self.links[i].to.equals(rtclink.remoteCallParticipation)) {
            // Notify parent of link status change
            if (self.onlinkstatechange)
               self.onlinkstatechange(null, self.links[i]);
            self.links.splice(i, 1);
            found = true;
            break;
         }
      }
   }
}

