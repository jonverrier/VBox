/*! Copyright TXPCo, 2020 */
// References:
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
// https://medium.com/xamarin-webrtc/webrtc-signaling-server-dc6e38aaefba 
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation
//
// TODO - improve implementation of event firing / callback functions, which is  
// currently duplicate for a 'single' function overwrite vs adding multiple listeners 

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
import { Queue } from '../common/queue.js';
import { Logger } from './logger';


var logger = new Logger();

// Helper class - take a name like 'Jon' and if the name is not unique for the session,
// tries variants like 'Jon:1', 'Jon:2' and so on until a unique one (for this session) is found.
// This is to distinguish the same person joining mutliple times (multiple devices or serial log ins such as browser refresh)
class RtcNameCache {
   // member variables
   nameMap: Map<string, boolean>;

   constructor() {
      this.nameMap = new Map<string, boolean> ();
   }

   addReturnUnique(name: string) : string {
      if (!this.nameMap.has(name)) {
         this.nameMap.set(name, true);
         return name;
      }

      var index: number = 1;
      while (true) {
         var newName = name + ':' + index.toString();
         if (!this.nameMap.has(newName)) {
            this.nameMap.set(newName, true);
            return newName;
         }
         index++;
      }
   }
}

class RtcCaller {
   // member variables
   localCallParticipation: CallParticipation;
   remoteCallParticipation: CallParticipation;
   localPerson: Person;
   remotePerson: Person;
   sendConnection: RTCPeerConnection;
   sendChannel: RTCDataChannel;
   recieveChannel: RTCDataChannel;
   isChannelConnected: boolean;
   isIceConnected: boolean;
   iceQueue: Queue;
   sendQueue: Queue;
   nameCache: RtcNameCache;

   constructor(localCallParticipation: CallParticipation,
      remoteCallParticipation: CallParticipation,
      person: Person,
      nameCache: RtcNameCache) {
      this.localCallParticipation = localCallParticipation;
      this.remoteCallParticipation = remoteCallParticipation;
      this.localPerson = person;
      this.remotePerson = null;
      this.sendConnection = null;
      this.sendChannel = null;
      this.recieveChannel = null;
      this.isChannelConnected = false;
      this.isIceConnected = false;
      this.iceQueue = new Queue();
      this.sendQueue = new Queue();
      this.nameCache = nameCache;
   }

   // Override these for notifications - TODO - see top of file
   onremoteclose: ((this: RtcCaller, ev: Event) => any) | null;
   onremoteissues: ((this: RtcCaller, ev: Event) => any) | null;
   onremoteconnection: ((this: RtcCaller, ev: Event) => any) | null;
   onremotedata: ((this: RtcCaller, ev: Event) => any) | null;

   placeCall() {

      var self = this;

      let configuration = {
         iceServers: [{
            "urls": "stun:ec2-18-216-213-192.us-east-2.compute.amazonaws.com:3480?transport=tcp"
         },
         {
            "urls": "stun:stun.l.google.com:19302?transport=tcp"
         },
         {
            "urls": "stun:stun1.l.google.com:19302?transport=tcp"
         }]
      };

      this.sendConnection = new RTCPeerConnection(configuration);
      this.sendConnection.onicecandidate = (ice) => {
         self.onicecandidate(ice.candidate, self.remoteCallParticipation);
      };
      this.sendConnection.onnegotiationneeded = (ev) => { self.onnegotiationneeded(ev, self) };
      this.sendConnection.ondatachannel = (ev) => { self.onrecievedatachannel(ev, self) };
      this.sendConnection.oniceconnectionstatechange = (ev) => { self.oniceconnectionstatechange(ev, self.sendConnection, true); };
      this.sendConnection.onconnectionstatechange = (ev) => { self.onconnectionstatechange(ev, self.sendConnection, self); };
      this.sendConnection.onicecandidateerror = (ev) => { self.onicecandidateerror(ev, self); };

      self.sendChannel = this.sendConnection.createDataChannel("FromCallerSend");
      self.sendChannel.onerror = this.onsendchannelerror;
      self.sendChannel.onmessage = this.onsendchannelmessage;
      self.sendChannel.onopen = (ev) => { this.onsendchannelopen(ev, self.sendChannel, self.localCallParticipation); };
      self.sendChannel.onclose = this.onsendchannelclose;
   }

   handleAnswer(answer: CallAnswer) {
      var self = this;

      if (!this.isIceConnected) {
         this.sendConnection.setRemoteDescription(new RTCSessionDescription(answer))
            .then(() => {
               logger.info('RtcCaller', 'handleAnswer', 'succeeded', null);

               // Dequeue any iceCandidates that were enqueued while we had not set remoteDescription
               while (!self.iceQueue.isEmpty()) {
                  self.handleIceCandidate.bind(self)(self.iceQueue.dequeue());
               }
            })
            .catch(e => {

               logger.error('RtcCaller', 'handleAnswer', 'error:', e);
            });
      }
   }

   handleIceCandidate(ice) {

      // ICE candidates can arrive before call offer/answer
      // If we have not yet set remoteDescription, queue the iceCandidate for later
      if (!this.sendConnection
         || !this.sendConnection.remoteDescription
         || !this.sendConnection.remoteDescription.type) {
         this.iceQueue.enqueue(ice);
         return;
      }

      if (ice) {
         if (!this.isIceConnected) { // dont add another candidate if we are connected
            this.sendConnection.addIceCandidate(new RTCIceCandidate(ice))
               .catch(e => {
                  // TODO - analyse error paths
                  logger.error('RtcCaller', 'handleIceCandidate', "error:", e);
               });
         }
      } /* Debugging ICE - does setting a null candidate from the remote interfere with the local?? 
      else {
         this.sendConnection.addIceCandidate(null)
            .catch(e => {
               // TODO - analyse error paths
               logger.error('RtcCaller', 'handleIceCandidate', "error on null ICE candidate:", e);
            });
      } */ 
   }

   onicecandidate(candidate, to: CallParticipation) {

      var self = this;

      // Send our call ICE candidate in
      var callIceCandidate = new CallIceCandidate(null, self.localCallParticipation, to, candidate, true);
      axios.post ('/api/icecandidate', { params: { callIceCandidate: callIceCandidate } })
         .then((response) => {
            logger.info('RtcCaller', 'onicecandidate', 'Post Ok, candidate:', candidate);
         })
         .catch((e) => {
            // TODO - analyse error paths
            logger.error ('RtcCaller', 'onicecandidate', 'Post error:', e);
         });
   }

   onnegotiationneeded(ev, self) {

      logger.info('RtcCaller', 'onnegotiationneeded', 'Event:', ev);

      // ICE enumeration does not start until we create a local description, so call createOffer() to kick this off
      self.sendConnection.createOffer({iceRestart: true}) 
         .then(offer => self.sendConnection.setLocalDescription(offer))
         .then(() => {
            // Send our call offer data in
            logger.info('RtcCaller', 'onnegotiationneeded', 'Posting offer', null);
            var callOffer = new CallOffer(null, self.localCallParticipation, self.remoteCallParticipation, self.sendConnection.localDescription);
            axios.post ('/api/offer', { params: { callOffer: callOffer } })
               .then((response) => {
                  logger.info('RtcCaller', 'onnegotiationneeded', "Post Ok", null);
               });
         })
         .catch(function (error) {
            // TODO - analyse error paths 
            logger.error('RtcCaller', 'onnegotiationneeded', 'error', error);
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

      if (state === "connected") {
         this.isIceConnected = true;
      }
      if (state === "failed") {
         this.isIceConnected = false;
         if (pc.restartIce) {
            pc.restartIce();
         }
      }
   }

   onconnectionstatechange(ev, pc, self) {
      switch (pc.connectionState) {
         case "connected":
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
            // The connection has been closed or failed
            self.isChannelConnected = false;
            if (self.onremoteclose)
               self.onremoteclose(ev);
            break;
         case "closed":
            // The connection has been closed or failed
            self.isChannelConnected = false;
            if (self.onremoteclose)
               self.onremoteclose(ev);
            break;
      }
   }

   onicecandidateerror(ev, self) {
      if (ev.errorCode === 701) {
         logger.error('RtcCaller', 'onicecandidateerror', ev.url + ' ', ev.errorText);
      } else {
         logger.info('RtcCaller', 'onicecandidateerror', 'event:', ev);
      }
   }

   onsendchannelopen(ev, dc, localCallParticipation: CallParticipation) {
      logger.info('RtcCaller', 'onsendchannelopen', "sender is:", localCallParticipation.sessionSubId);

      this.isChannelConnected = true;

      try {
         dc.send(JSON.stringify (this.localPerson));
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

   onrecievechannelmessage(msg, localCallParticipation: CallParticipation) {
      // Too noisy to keep this on 
      // logger.info('RtcCaller', 'onrecievechannelmessage', "message:", msg.data);

      var types = new TypeRegistry();
      var remoteCallData = types.reviveFromJSON(msg.data);

      // Store the person we are talking to - allows tracking in the UI later
      if (remoteCallData.__type === Person.prototype.__type) {
         // Store a unique derivation of nam in case they join multiple times
         remoteCallData.name = this.nameCache.addReturnUnique(remoteCallData.name);
         this.remotePerson = remoteCallData;
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

   send(obj) {
      if (this.sendChannel && this.sendChannel.readyState === 'open') {
         // Dequeue any messages that were enqueued while we were not ready
         while (!this.sendQueue.isEmpty()) {
            this.sendChannel.send(JSON.stringify(this.sendQueue.dequeue()));
         }
         this.sendChannel.send(JSON.stringify(obj));
      } else {
         this.sendQueue.enqueue(obj);
      }
   }
}

class RtcReciever {
   // member variables
   localCallParticipation: CallParticipation;
   remoteCallParticipation: CallParticipation;
   localPerson: Person;
   remotePerson: Person;
   recieveConnection: RTCPeerConnection;
   sendChannel: RTCDataChannel;
   recieveChannel: RTCDataChannel;
   isChannelConnected: boolean;
   isIceConnected: boolean;
   iceQueue: Queue;
   sendQueue: Queue;
   nameCache: RtcNameCache;

   constructor(localCallParticipation: CallParticipation,
      remoteCallParticipation: CallParticipation,
      person: Person,
      nameCache: RtcNameCache) {
      this.localCallParticipation = localCallParticipation;
      this.remoteCallParticipation = remoteCallParticipation;
      this.localPerson = person;
      this.remotePerson = null;;
      this.recieveConnection = null;
      this.sendChannel = null;
      this.recieveChannel = null;
      this.isChannelConnected = false;
      this.isIceConnected = false;
      this.iceQueue = new Queue();
      this.sendQueue = new Queue();
      this.nameCache = nameCache;
   }

   // Override these for notifications  - TODO - see top of file
   onremoteclose: ((this: RtcReciever, ev: Event) => any) | null;
   onremoteissues: ((this: RtcReciever, ev: Event) => any) | null;
   onremoteconnection: ((this: RtcReciever, ev: Event) => any) | null;
   onremotedata: ((this: RtcReciever, ev: Event) => any) | null;

   answerCall(remoteOffer: CallOffer) {

      var self = this;

      let configuration = {
         iceServers: [{
            "urls": "stun:ec2-18-216-213-192.us-east-2.compute.amazonaws.com:3480?transport=tcp"
         },
         {
            "urls": "stun:stun.l.google.com:19302?transport=tcp"
         },
         {
            "urls": "stun:stun1.l.google.com:19302?transport=tcp"
         }]
      };

      this.recieveConnection = new RTCPeerConnection(configuration);
      this.recieveConnection.onicecandidate = (ice) => {
         self.onicecandidate(ice.candidate, self.remoteCallParticipation);
      };
      this.recieveConnection.onnegotiationneeded = this.onnegotiationneeded;
      this.recieveConnection.ondatachannel = (ev) => { self.onrecievedatachannel(ev, self) };
      this.recieveConnection.oniceconnectionstatechange = (ev) => { self.oniceconnectionstatechange(ev, self.recieveConnection, false); };
      this.recieveConnection.onconnectionstatechange = (ev) => { self.onconnectionstatechange(ev, self.recieveConnection, self); };
      this.recieveConnection.onicecandidateerror = (ev) => { self.onicecandidateerror(ev, self); };

      this.sendChannel = this.recieveConnection.createDataChannel("FromAnswerSend");
      this.sendChannel.onerror = this.onsendchannelerror;
      this.sendChannel.onmessage = this.onsendchannelmessage;
      this.sendChannel.onopen = (ev) => { this.onsendchannelopen(ev, self.sendChannel, self.localCallParticipation); };
      this.sendChannel.onclose = this.onsendchannelclose;

      this.recieveConnection.setRemoteDescription(new RTCSessionDescription(remoteOffer.offer))
         .then(() => self.recieveConnection.createAnswer({ iceRestart: true })) 
         .then((answer) => self.recieveConnection.setLocalDescription(answer))
         .then(() => {
            logger.info('RtcReciever', 'answerCall', 'Posting answer', null);
            // Send our call answer data in
            var callAnswer = new CallAnswer(null, self.localCallParticipation, remoteOffer.from, self.recieveConnection.localDescription);
            axios.post ('/api/answer', { params: { callAnswer: callAnswer } })
               .then((response) => {
                  // Dequeue any iceCandidates that were enqueued while we had not set remoteDescription
                  while (!self.iceQueue.isEmpty()) {
                     self.handleIceCandidate.bind(self) (self.iceQueue.dequeue())
                  }

                  logger.info('RtcReciever', 'answerCall', 'Post Ok', null);
               })
         })
         .catch((e) => {
            // TODO - analyse error paths
            logger.error('RtcReciever', 'answerCall', "error:", e);
         });
   }

   handleIceCandidate(ice) {
      // ICE candidates can arrive before call offer/answer
      // If we have not yet set remoteDescription, queue the iceCandidate for later
      if (!this.recieveConnection
         || !this.recieveConnection.remoteDescription
         || !this.recieveConnection.remoteDescription.type) {
         this.iceQueue.enqueue(ice);
         return;
      }

      if (ice) {
         if (!this.isIceConnected) { // dont add another candidate if we are connected
            this.recieveConnection.addIceCandidate(new RTCIceCandidate(ice))
               .catch(e => {
                  // TODO - analyse error paths
                  logger.error('RtcReciever', 'handleIceCandidate', "error:", e);
               });
         }
      } /* Debugging ICE - does setting a null candidate from the remote interfere with the local?? 
       * else {
         this.recieveConnection.addIceCandidate(null)
            .catch(e => {
               // TODO - analyse error paths
               logger.error('RtcReciever', 'handleIceCandidate', "error on null ICE candidate:", e);
            });
      } */
   }

   onicecandidate(candidate, to: CallParticipation) {

      var self = this;

      // Send our call ICE candidate in
      var callIceCandidate = new CallIceCandidate(null, self.localCallParticipation, to, candidate, false);
      axios.post ('/api/icecandidate', { params: { callIceCandidate: callIceCandidate } })
         .then((response) => {
            logger.info('RtcReciever', 'onicecandidate', 'Post Ok, candidate:', candidate);
         })
         .catch((e) => {
            // TODO - analyse error paths
            logger.error('RtcReciever', 'onicecandidate', "Post error:", e);
         });
   }

   onnegotiationneeded(ev) {
      var self = this;

      logger.info('RtcReciever', 'onnegotiationneeded', 'Event:', ev);
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

      if (state === "connected") {
         this.isIceConnected = true;
      }
      else
      if (state === "failed") {
         this.isIceConnected = false;
         if (pc.restartIce) {
            pc.restartIce();
         }
      }
   }

   onconnectionstatechange(ev, pc, self) {
      switch (pc.connectionState) {
         case "connected":
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
            // The connection has been closed or failed
            self.isChannelConnected = false;
            if (self.onremoteclose)
               self.onremoteclose(ev);
         case "closed":
            // The connection has been closed or failed
            self.isChannelConnected = false;
            if (self.onremoteclose)
               self.onremoteclose(ev);
            break;
      }
   }

   onicecandidateerror(ev, self) {
      if (ev.errorCode === 701) {
         logger.error('RtcReciever', 'onicecandidateerror', ev.url + ' ', ev.errorText);
      } else {
         logger.info('RtcReciever', 'onicecandidateerror', 'event:', ev);
      }
   }

   onsendchannelopen(ev, dc, localCallParticipation: CallParticipation) {
      logger.info('RtcReciever', 'onsendchannelopen', 'sender session is:', localCallParticipation.sessionSubId);

      this.isChannelConnected = true;
      try {
         // By convention, new joiners broadcast a 'Person' object
         dc.send(JSON.stringify(this.localPerson));
      }
      catch (e) {
         logger.error('RtcReciever', 'onsendchannelopen', "error:", e);
      }
   }

   onsendchannelmessage(msg) {
      logger.info('RtcReciever', 'onsendchannelmessage', 'message:', msg.data);
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

   onrecievechannelmessage(msg, localCallParticipation: CallParticipation) {
      // Too noisy to keep this on 
      // logger.info('RtcReciever', 'onrecievechannelmessage', "message:", msg.data);

      var types = new TypeRegistry();
      var remoteCallData = types.reviveFromJSON(msg.data);

      // Store the person we are talking to - allows tracking in the UI later
      if (remoteCallData.__type === Person.prototype.__type) {
         // Store a unique derivation of nam in case they join multiple times
         remoteCallData.name = this.nameCache.addReturnUnique(remoteCallData.name);
         this.remotePerson = remoteCallData;
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

   send(obj) {
      if (this.sendChannel && this.sendChannel.readyState === 'open') {
         // Dequeue any messages that were enqueued while we were not ready
         while (!this.sendQueue.isEmpty()) {
            this.sendChannel.send(JSON.stringify(this.sendQueue.dequeue()));
         }
         this.sendChannel.send(JSON.stringify(obj));
      } else {
         this.sendQueue.enqueue(obj);
      }
   }
}

export class RtcLink {
   // member variables
   to: CallParticipation;
   outbound: boolean;
   caller: RtcCaller;
   reciever: RtcReciever;
   linkStatus: FourStateRagEnum;

   constructor(to: CallParticipation,
      outbound: boolean,
      caller: RtcCaller,
      reciever: RtcReciever) {
      this.to = to;
      this.outbound = outbound;
      this.caller = caller;
      this.reciever = reciever;
      this.linkStatus = FourStateRagEnum.Indeterminate;

      if (reciever) {
         reciever.onremoteclose = this.onremoterecieverclose.bind(this);
         reciever.onremoteissues = this.onremoterecieverissues.bind(this);
         reciever.onremoteconnection = this.onremoterecieverconnection.bind(this);
      }
      if (caller) {
         caller.onremoteclose = this.onremotesenderclose.bind(this);
         caller.onremoteissues = this.onremotesenderissues.bind(this);
         caller.onremoteconnection = this.onremotesenderconnection.bind(this);
      }
   }

   // Override these for notifications  - TODO - see top of file
   onlinkstatechange: ((this: RtcLink, ev: Event) => any) | null;

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

   send(obj) {
      if (this.outbound && this.caller)
         this.caller.send(obj);
      if (!this.outbound && this.reciever)
         this.reciever.send(obj);
   }
}

export interface IRtcProps {
   facilityId: string;
   sessionId: string;
   personId: string;
   personName: string;
   personThumbnailUrl: string;
   isEdgeOnly: boolean; // If this is set, does not set up links with new participants - we are reciever only
}

export class Rtc {

   // member variables
   localCallParticipation: CallParticipation;
   person: Person;
   events: EventSource;
   links: RtcLink[];
   lastSequenceNo: number;
   serverLinkStatus: FourStateRagEnum;
   retries: number;
   datalisteners: Array<Function>;
   isEdgeOnly: boolean;
   nameCache: RtcNameCache;

   constructor(props: IRtcProps) {
      this.localCallParticipation = null;
      this.links = new Array();
      this.lastSequenceNo = 0;
      this.datalisteners = new Array();
      this.isEdgeOnly = props.isEdgeOnly;
      this.nameCache = new RtcNameCache();

      // Create a unique id to this call participation by appending a UUID for the browser tab we are connecting from
      this.localCallParticipation = new CallParticipation(null, props.facilityId, props.personId, !this.isEdgeOnly, props.sessionId, uuidv4());

      // Store data on the Person who is running the app - used in data handshake & exchange
      this.person = new Person(null, props.personId, props.personName, null, props.personThumbnailUrl, null);

      this.retries = 0;
      this.serverLinkStatus = FourStateRagEnum.Indeterminate;

      // This is a deliberate no-op - just allows easier debugging by having a variable to hover over. 
      logger.info("Rtc", 'constructor', 'Browser:', adapter.browserDetails);
   }

   addremotedatalistener(fn) {
      this.datalisteners.push(fn);
   };

   connectFirst() {
      this.connect();
   }

   connect() {
      logger.info('Rtc', 'connect', "", null);

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

   coachLinkStatus() {

      for (var i = 0; i < this.links.length; i++) {
         if (this.links[i].reciever && this.links[i].reciever.remotePerson
            && this.links[i].reciever.remoteCallParticipation.isCandidateLeader
            && this.links[i].reciever.isChannelConnected) {
            return FourStateRagEnum.Green;
         }
         if (this.links[i].caller && this.links[i].caller.remotePerson
            && this.links[i].caller.remoteCallParticipation.isCandidateLeader
            && this.links[i].caller.isChannelConnected) {
            return FourStateRagEnum.Green;
         }
      }
      return FourStateRagEnum.Indeterminate;
   }

   memberLinkStatus(name: string) {

      for (var i = 0; i < this.links.length; i++) {
         if (this.links[i].reciever && this.links[i].reciever.remotePerson
            && this.links[i].reciever.remotePerson.name === name) {
            if (this.links[i].reciever.isChannelConnected)
               return FourStateRagEnum.Green;
            else
               return FourStateRagEnum.Red;
         }
         if (this.links[i].caller && this.links[i].caller.remotePerson
            && this.links[i].caller.remotePerson.name === name) {
            if (this.links[i].caller.isChannelConnected)
               return FourStateRagEnum.Green;
            else
               return FourStateRagEnum.Red;
         }
      }
      return FourStateRagEnum.Indeterminate;
   }

   broadcast (obj) {
      var self = this;

      for (var i = 0; i < self.links.length; i++) {
         self.links[i].send(obj);
      }
   }

   onServerEvent(ev) {

      this.retries = 0;

      // RAG status checking and notification
      if (this.serverLinkStatus !== FourStateRagEnum.Green) {
         this.serverLinkStatus = FourStateRagEnum.Green;
      }

      var types = new TypeRegistry();
      var remoteCallData = types.reviveFromJSON(ev.data);
      var payload = remoteCallData.data;

      switch (payload.__type) {
         case "CallParticipation":
            logger.info('Rtc', 'onServerEvent', "CallParticipation", null);
            this.onParticipant(payload);
            break;
         case "CallOffer":
            logger.info('Rtc', 'onServerEvent', "CallOffer", null);
            this.onOffer(payload);
            break;
         case "CallAnswer":
            logger.info('Rtc', 'onServerEvent', "CallAnswer", null);
            this.onAnswer(payload);
            break;
         case "CallIceCandidate":
            logger.info('Rtc', 'onServerEvent', "CallIceCandidate", payload.ice);
            this.onRemoteIceCandidate(payload);
            break;
         case "CallKeepAlive": // Nothing - don't log as it creates noise in the log.
            break;
         default:
            logger.info('Rtc', 'onServerEvent', "data:", payload);
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
         if (this.serverLinkStatus !== FourStateRagEnum.Red) {
            this.serverLinkStatus = FourStateRagEnum.Red;
         }
      } else {
         // RAG status checking and notification
         if (this.serverLinkStatus !== FourStateRagEnum.Amber) {
            this.serverLinkStatus = FourStateRagEnum.Amber;
         }
      }
   }


   onParticipant(remoteParticipation) {
      var self = this;

      // If we are an edge node, and the caller is nota leader, dont respond.
      if (self.isEdgeOnly && !remoteParticipation.isCandidateLeader)
         return;

      var sender = new RtcCaller(self.localCallParticipation, remoteParticipation, self.person, self.nameCache); 
      var link = new RtcLink(remoteParticipation, true, sender, null);

      // Hooks to pass up data
      sender.onremotedata = (ev) => {
         if (this.datalisteners) {
            for (var i = 0; i < this.datalisteners.length; i++) {
               this.datalisteners[i](ev, link);
            }
         }
      };

      self.links.push(link);

      // place the call after setting up 'links' to avoid a race condition
      sender.placeCall();
   }

   setupRecieverLink(remoteParticipant: CallParticipation): RtcReciever {
      var self = this;

      var reciever = new RtcReciever(self.localCallParticipation, remoteParticipant, self.person, self.nameCache);
      var link = new RtcLink(remoteParticipant, false, null, reciever);

      // Hooks to pass up data
      reciever.onremotedata = (ev) => {
         if (this.datalisteners) {
            for (var i = 0; i < this.datalisteners.length; i++) {
               this.datalisteners[i](ev, link);
            }
         }
      };

      self.links.push(link);

      return reciever;
   }

   onOffer(remoteOffer) {
      var self = this;

      // This loop removes glare, when we may be trying to set up calls with each other.
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

      // Setup links befoe answering the call to remove race conditions from asynchronous arrival
      var reciever = this.setupRecieverLink(remoteOffer.from);
      reciever.answerCall(remoteOffer);
   }

   onAnswer(remoteAnswer) {
      var self = this;
      var found = false;

      for (var i = 0; i < self.links.length; i++) {
         if (self.links[i].to.equals(remoteAnswer.from)) {
            self.links[i].caller.handleAnswer(remoteAnswer.answer);
            found = true;
            break;
         }
      }
      if (!found)
         logger.error('RtcLink', 'onAnswer', "cannot find target:", remoteAnswer);
   }

   onRemoteIceCandidate(remoteIceCandidate: CallIceCandidate) {
      var self = this;
      var found : boolean = false;

      for (var i = 0; i < self.links.length && !found; i++) {
         if (self.links[i].to.equals(remoteIceCandidate.from)) {
            found = true;
         }
      }

      if (!found) {
         this.setupRecieverLink(remoteIceCandidate.from);
      }

      found = false;

      // Ice candidate messages can be sent while we are still resolving glare - e.g. we are calling each other, and we killed our side while we have
      // incoming messages still pending
      // So fail silently if we get unexpected Ice candidate messages 
      for (var i = 0; i < self.links.length; i++) {
         if (self.links[i].to.equals(remoteIceCandidate.from)) {
            if (remoteIceCandidate.outbound) {
               if (self.links[i].reciever) 
                  self.links[i].reciever.handleIceCandidate(remoteIceCandidate.ice);
               // else silent fail
            } else {
               if (self.links[i].caller)
                  self.links[i].caller.handleIceCandidate(remoteIceCandidate.ice);
               // else silent fail
            }
            found = true;
            break;
         }
      }
      if (!found) {
         logger.error('Rtc', 'onRemoteIceCandidate', "Remote:", remoteIceCandidate);
         logger.error('Rtc', 'onRemoteIceCandidate', "Links:", self.links);
      }
   }
}

