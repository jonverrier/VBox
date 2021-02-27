/*! Copyright TXPCo, 2020, 2021 */
// References:
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
// https://medium.com/xamarin-webrtc/webrtc-signaling-server-dc6e38aaefba 
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation
//
// TODO - improve implementation of event firing / callback functions, which is  
// currently duplicate for a 'single' function overwrite vs adding multiple listeners 

import * as React from 'react';
import axios from 'axios';
import adapter from 'webrtc-adapter'; // Google shim library
 
// This app
import { Person } from '../../core/dev/Person';
import { CallParticipation, CallOffer, CallAnswer, CallIceCandidate } from '../../core/dev/Call';
import { TypeRegistry } from '../../core/dev/Types';
import { FourStateRagEnum } from '../../core/dev/Enum';
import { Queue } from '../../core/dev/Queue';
import { LoggerFactory, LoggerType } from '../../core/dev/Logger';
import { IPeerSignaller, IPeerCaller, IPeerReciever } from './PeerInterfaces';
import { PeerNameCache, RtcPeerHelper } from './PeerRtc';
import { Signaller} from './PeerSignaller';
import { IStreamable } from '../../core/dev/Streamable';

function uuidPart(): string {
   return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase();
};

function uuid(): string {
   return (uuidPart() + uuidPart() + "-" + uuidPart() + "-" + uuidPart() + "-" + uuidPart() + "-" + uuidPart() + uuidPart() + uuidPart());
}

var logger = new LoggerFactory().logger (LoggerType.Client);

class RtcCaller implements IPeerCaller {
   // member variables
   peerHelp: RtcPeerHelper;
   sendConnection: RTCPeerConnection;
   iceQueue: Queue<any>;
   signaller: IPeerSignaller;

   constructor(localCallParticipation: CallParticipation,
      remoteCallParticipation: CallParticipation,
      person: Person,
      nameCache: PeerNameCache,
      signaller: IPeerSignaller) {

      this.peerHelp = new RtcPeerHelper(localCallParticipation,
         remoteCallParticipation,
         person, nameCache);
      this.signaller = signaller;

      // Hook to pass any data up the chain
      this.peerHelp.onRemoteData = this.onRemoteDataInner.bind(this);

      this.sendConnection = null;
      this.iceQueue = new Queue();
   }

   // Override these for notifications - TODO - see top of file
   onRemoteData: ((this: RtcCaller, ev: IStreamable) => any) | null;

   placeCall() : void {

      let configuration = {
         iceServers: [{
            "urls": "stun:stun.l.google.com:19302?transport=tcp"
         },
         {
            "urls": "stun:stun1.l.google.com:19302?transport=tcp"
         },
         {
            "urls": "stun:ec2-18-216-213-192.us-east-2.compute.amazonaws.com:3480?transport=tcp"
         }
         ]
      };

      this.sendConnection = new RTCPeerConnection(configuration);
      this.sendConnection.onicecandidate = (ice) => {
         this.onicecandidate(ice.candidate, this.peerHelp.remoteCallParticipation);
      };
      this.sendConnection.onnegotiationneeded = (ev) => { this.onnegotiationneeded(ev) };
      this.sendConnection.ondatachannel = (ev) => { this.peerHelp.onRecieveDataChannel(ev.channel) };
      this.sendConnection.oniceconnectionstatechange = (ev) => { this.peerHelp.onIceConnectionStateChange(ev, this.sendConnection); };
      this.sendConnection.onconnectionstatechange = (ev) => { this.peerHelp.onConnectionStateChange(ev, this.sendConnection); };
      this.sendConnection.onicecandidateerror = (ev) => { this.peerHelp.onIceCandidateError(ev); };

      this.peerHelp.createSendChannel(this.sendConnection, "FromCall");
   }

   handleAnswer(answer: CallAnswer) : void {
      var self = this;

      if (!this.peerHelp.isIceConnected) {
         this.sendConnection.setRemoteDescription(new RTCSessionDescription(answer.answer))
            .then(() => {
               logger.logInfo('RtcCaller', 'handleAnswer', 'succeeded', null);

               // Dequeue any iceCandidates that were enqueued while we had not set remoteDescription
               while (!self.iceQueue.isEmpty()) {
                  self.handleIceCandidate.bind(self)(self.iceQueue.dequeue());
               }
            })
            .catch(e => {

               logger.logError('RtcCaller', 'handleAnswer', 'error:', e);
            });
      }
   }

   handleIceCandidate(ice: CallIceCandidate) : void {

      // ICE candidates can arrive before call offer/answer
      // If we have not yet set remoteDescription, queue the iceCandidate for later
      if (!this.sendConnection
         || !this.sendConnection.remoteDescription
         || !this.sendConnection.remoteDescription.type) {
         this.iceQueue.enqueue(ice);
         return;
      }

      if (ice) {
         if (!this.peerHelp.isIceConnected) { // dont add another candidate if we are connected
            this.sendConnection.addIceCandidate(new RTCIceCandidate(ice.ice))
               .catch(e => {
                  // TODO - analyse error paths
                  logger.logError('RtcCaller', 'handleIceCandidate', "error:", e);
               });
         }
      } /* Debugging ICE - does setting a null candidate from the remote interfere with the local?? 
      else {
         this.sendConnection.addIceCandidate(null)
            .catch(e => {
               // TODO - analyse error paths
               logger.logError('RtcCaller', 'handleIceCandidate', "error on null ICE candidate:", e);
            });
      } */ 
   }

   send(obj: IStreamable): void {
      this.peerHelp.send(obj);
   }

   onicecandidate(candidate, to: CallParticipation) {

      var self = this;

      // Send our call ICE candidate in
      var callIceCandidate = new CallIceCandidate(null, self.peerHelp.localCallParticipation, to, candidate, true);
      this.signaller.sendIceCandidate(callIceCandidate);
   }

   onnegotiationneeded(ev: Event) {

      logger.logInfo('RtcCaller', 'onnegotiationneeded', 'Event:', ev);

      // ICE enumeration does not start until we create a local description, so call createOffer() to kick this off
      this.sendConnection.createOffer({ iceRestart: true })
         .then(offer => this.sendConnection.setLocalDescription(offer))
         .then(() => {
             // Send our call offer data in
             logger.logInfo('RtcCaller', 'onnegotiationneeded', 'Posting offer', null);
            var callOffer = new CallOffer(null, this.peerHelp.localCallParticipation, this.peerHelp.remoteCallParticipation, this.sendConnection.localDescription);
             this.signaller.sendOffer(callOffer);
         })          
   };

   private onRemoteDataInner(ev: IStreamable): void {

      if (this.onRemoteData) {
         this.onRemoteData(ev);
      }
   }
}

class RtcReciever implements IPeerReciever {
   // member variables
   peerHelp: RtcPeerHelper;
   recieveConnection: RTCPeerConnection;
   iceQueue: Queue<any>;
   signaller: IPeerSignaller;

   constructor(localCallParticipation: CallParticipation,
      remoteCallParticipation: CallParticipation,
      person: Person,
      nameCache: PeerNameCache,
      signaller: IPeerSignaller) {

      this.peerHelp = new RtcPeerHelper(localCallParticipation,
         remoteCallParticipation,
         person, nameCache);
      this.signaller = signaller;

      // Hook to pass any data up the chain
      this.peerHelp.onRemoteData = this.onRemoteDataInner.bind(this);

      this.recieveConnection = null;

      this.iceQueue = new Queue();
   }

   // Override these for notifications  - TODO - see top of file
   onRemoteData: ((this: RtcReciever, ev: IStreamable) => any) | null;

   answerCall(remoteOffer: CallOffer) : void {

      var self = this;

      let configuration = {
         iceServers: [
         {
            "urls": "stun:stun.l.google.com:19302?transport=tcp"
         },
         {
            "urls": "stun:stun1.l.google.com:19302?transport=tcp"
         },
         {
            "urls": "stun:ec2-18-216-213-192.us-east-2.compute.amazonaws.com:3480?transport=tcp"
         }]
      };

      this.recieveConnection = new RTCPeerConnection(configuration);
      this.recieveConnection.onicecandidate = (ice) => {
         self.onicecandidate(ice.candidate, self.peerHelp.remoteCallParticipation);
      };
      this.recieveConnection.onnegotiationneeded = this.onnegotiationneeded;
      this.recieveConnection.ondatachannel = (ev) => { self.peerHelp.onRecieveDataChannel(ev.channel) };
      this.recieveConnection.oniceconnectionstatechange = (ev) => { self.peerHelp.onIceConnectionStateChange(ev, self.recieveConnection); };
      this.recieveConnection.onconnectionstatechange = (ev) => { self.peerHelp.onConnectionStateChange(ev, self.recieveConnection); };
      this.recieveConnection.onicecandidateerror = (ev) => { self.peerHelp.onIceCandidateError(ev); };

      this.peerHelp.createSendChannel(this.recieveConnection, "FromAnswer");

      this.recieveConnection.setRemoteDescription(new RTCSessionDescription(remoteOffer.offer))
         .then(() => self.recieveConnection.createAnswer({ iceRestart: true })) 
         .then((answer) => self.recieveConnection.setLocalDescription(answer))
         .then(() => {
            logger.logInfo('RtcReciever', 'answerCall', 'Posting answer', null);
            // Send our call answer data in
            var callAnswer = new CallAnswer(null, self.peerHelp.localCallParticipation, remoteOffer.from, self.recieveConnection.localDescription);
            axios.post ('/api/answer', { params: { callAnswer: callAnswer } })
               .then((response) => {
                  // Dequeue any iceCandidates that were enqueued while we had not set remoteDescription
                  while (!self.iceQueue.isEmpty()) {
                     self.handleIceCandidate.bind(self) (self.iceQueue.dequeue())
                  }

                  logger.logInfo('RtcReciever', 'answerCall', 'Post Ok', null);
               })
         })
         .catch((e) => {
            // TODO - analyse error paths
            logger.logError('RtcReciever', 'answerCall', "error:", e);
         });
   }

   handleIceCandidate(ice: CallIceCandidate) : void {
      // ICE candidates can arrive before call offer/answer
      // If we have not yet set remoteDescription, queue the iceCandidate for later
      if (!this.recieveConnection
         || !this.recieveConnection.remoteDescription
         || !this.recieveConnection.remoteDescription.type) {
         this.iceQueue.enqueue(ice);
         return;
      }

      if (ice) {
         if (!this.peerHelp.isIceConnected) { // dont add another candidate if we are connected
            this.recieveConnection.addIceCandidate(new RTCIceCandidate(ice.ice))
               .catch(e => {
                  // TODO - analyse error paths
                  logger.logError('RtcReciever', 'handleIceCandidate', "error:", e);
               });
         }
      } /* Debugging ICE - does setting a null candidate from the remote interfere with the local?? 
       * else {
         this.recieveConnection.addIceCandidate(null)
            .catch(e => {
               // TODO - analyse error paths
               logger.logError('RtcReciever', 'handleIceCandidate', "error on null ICE candidate:", e);
            });
      } */
   }

   send(obj: IStreamable) : void {
      this.peerHelp.send(obj);
   }

   onicecandidate(candidate, to: CallParticipation) {

      var self = this;

      // Send our call ICE candidate in
      var callIceCandidate = new CallIceCandidate(null, self.peerHelp.localCallParticipation, to, candidate, false);
      this.signaller.sendIceCandidate(callIceCandidate);
   }

   onnegotiationneeded(ev: Event) {
      var self = this;

      logger.logInfo('RtcReciever', 'onnegotiationneeded', 'Event:', ev);
   };

   private onRemoteDataInner(ev: IStreamable): void {

      if (this.onRemoteData) {
         this.onRemoteData(ev);
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
   }

   // Override these for notifications  - TODO - see top of file
   onlinkstatechange: ((this: RtcLink, ev: any) => any) | null;

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
   nameCache: PeerNameCache;
   signaller: IPeerSignaller;

   constructor(props: IRtcProps) {
      this.localCallParticipation = null;
      this.links = new Array();
      this.lastSequenceNo = 0;
      this.datalisteners = new Array();
      this.isEdgeOnly = props.isEdgeOnly;
      this.nameCache = new PeerNameCache();
      this.signaller = new Signaller();

      // Create a unique id to this call participation by appending a UUID for the browser tab we are connecting from
      this.localCallParticipation = new CallParticipation(null, props.facilityId, props.personId, !this.isEdgeOnly, props.sessionId, uuid());

      // Store data on the Person who is running the app - used in data handshake & exchange
      this.person = new Person(null, props.personId, props.personName, null, props.personThumbnailUrl, null);

      this.retries = 0;
      this.serverLinkStatus = FourStateRagEnum.Indeterminate;

      // This is a deliberate no-op - just allows easier debugging by having a variable to hover over. 
      logger.logInfo("Rtc", 'constructor', 'Browser:', adapter.browserDetails);
   }

   addremotedatalistener(fn) {
      this.datalisteners.push(fn);
   };

   connectFirst() {
      this.connect();
   }

   connect() {
      logger.logInfo('Rtc', 'connect', "", null);

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
         if (this.links[i].reciever && this.links[i].reciever.peerHelp.remotePerson
            && this.links[i].reciever.peerHelp.remoteCallParticipation.isCandidateLeader
            && this.links[i].reciever.peerHelp.isChannelConnected) {
            return FourStateRagEnum.Green;
         }
         if (this.links[i].caller && this.links[i].caller.peerHelp.remotePerson
            && this.links[i].caller.peerHelp.remoteCallParticipation.isCandidateLeader
            && this.links[i].caller.peerHelp.isChannelConnected) {
            return FourStateRagEnum.Green;
         }
      }
      return FourStateRagEnum.Indeterminate;
   }

   memberLinkStatus(name: string): FourStateRagEnum {

      for (var i = 0; i < this.links.length; i++) {
         if (this.links[i].reciever && this.links[i].reciever.peerHelp.remotePerson
            && this.links[i].reciever.peerHelp.remotePerson.name === name) {
            if (this.links[i].reciever.peerHelp.isChannelConnected)
               return FourStateRagEnum.Green;
            else
               return FourStateRagEnum.Red;
         }
         if (this.links[i].caller && this.links[i].caller.peerHelp.remotePerson
            && this.links[i].caller.peerHelp.remotePerson.name === name) {
            if (this.links[i].caller.peerHelp.isChannelConnected)
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

      switch (payload.type) {
         case "CallParticipation":
            logger.logInfo('Rtc', 'onServerEvent', "CallParticipation", null);
            this.onParticipant(payload);
            break;
         case "CallOffer":
            logger.logInfo('Rtc', 'onServerEvent', "CallOffer", null);
            this.onOffer(payload);
            break;
         case "CallAnswer":
            logger.logInfo('Rtc', 'onServerEvent', "CallAnswer", null);
            this.onAnswer(payload);
            break;
         case "CallIceCandidate":
            logger.logInfo('Rtc', 'onServerEvent', "CallIceCandidate", payload.ice);
            this.onRemoteIceCandidate(payload);
            break;
         case "CallKeepAlive": // Nothing - don't log as it creates noise in the log.
            break;
         default:
            logger.logInfo('Rtc', 'onServerEvent', "data:", payload);
            break;
      }

      this.lastSequenceNo = remoteCallData.sequenceNo;
   }

   onServerError(ev) {
      var self = this;

      logger.logInfo('RtcReciever', 'onServerError', "event:", ev);
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

      var sender = new RtcCaller(self.localCallParticipation, remoteParticipation, self.person, self.nameCache, self.signaller);
      var link = new RtcLink(remoteParticipation, true, sender, null);

      // Hooks to pass up data
      sender.onRemoteData = (ev) => {
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

      var reciever = new RtcReciever(self.localCallParticipation, remoteParticipant, self.person, self.nameCache, self.signaller);
      var link = new RtcLink(remoteParticipant, false, null, reciever);

      // Hooks to pass up data
      reciever.onRemoteData = (ev) => {
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
            self.links[i].caller.handleAnswer(remoteAnswer);
            found = true;
            break;
         }
      }
      if (!found)
         logger.logError('RtcLink', 'onAnswer', "cannot find target:", remoteAnswer);
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
                  self.links[i].reciever.handleIceCandidate(remoteIceCandidate);
               // else silent fail
            } else {
               if (self.links[i].caller)
                  self.links[i].caller.handleIceCandidate(remoteIceCandidate);
               // else silent fail
            }
            found = true;
            break;
         }
      }
      if (!found) {
         logger.logError('Rtc', 'onRemoteIceCandidate', "Remote:", remoteIceCandidate);
         logger.logError('Rtc', 'onRemoteIceCandidate', "Links:", self.links);
      }
   }
}

