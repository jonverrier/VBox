/*! Copyright TXPCo, 2020, 2021 */
//

// External libraries
import * as React from 'react';
import axios from 'axios';
import adapter from 'webrtc-adapter'; // Google shim library
 
// This app, external components
import { Person } from '../../core/dev/Person';
import { CallParticipation, CallOffer, CallAnswer, CallIceCandidate } from '../../core/dev/Call';
import { TypeRegistry } from '../../core/dev/Types';
import { FourStateRagEnum } from '../../core/dev/Enum';
import { LoggerFactory, LoggerType } from '../../core/dev/Logger';

// This app, this component
import { PeerNameCache, IPeerSignaller, IPeerCaller, IPeerReciever } from './PeerInterfaces';
import { PeerCallerRtc, PeerRecieverRtc } from './PeerRtc';
import { Signaller} from './PeerSignaller';

function uuidPart(): string {
   return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase();
};

function uuid(): string {
   return (uuidPart() + uuidPart() + "-" + uuidPart() + "-" + uuidPart() + "-" + uuidPart() + "-" + uuidPart() + uuidPart() + uuidPart());
}

var logger = new LoggerFactory().logger (LoggerType.Client);

export class RtcLink {
   // member variables
   to: CallParticipation;
   outbound: boolean;
   caller: PeerCallerRtc;
   reciever: PeerRecieverRtc;
   linkStatus: FourStateRagEnum;

   constructor(to: CallParticipation,
      outbound: boolean,
      caller: PeerCallerRtc,
      reciever: PeerRecieverRtc) {
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

      logger.logInfo('Rtc', 'onServerError', "event:", ev);
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

      var sender = new PeerCallerRtc (self.localCallParticipation, remoteParticipation, self.person, self.nameCache, self.signaller);
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

   setupRecieverLink(remoteParticipant: CallParticipation): PeerRecieverRtc {
      var self = this;

      var reciever = new PeerRecieverRtc (self.localCallParticipation, remoteParticipant, self.person, self.nameCache, self.signaller);
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

