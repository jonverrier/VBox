/*! Copyright TXPCo, 2020, 2021 */
//

// External libraries
import * as React from 'react';
import axios from 'axios';
import adapter from 'webrtc-adapter'; // Google shim library
 
// This app, external components
import { Person } from '../../core/dev/Person';
import { ETransportType, CallParticipation, CallOffer, CallAnswer, CallIceCandidate } from '../../core/dev/Call';
import { IStreamable } from '../../core/dev/Streamable';
import { LoggerFactory, ELoggerType } from '../../core/dev/Logger';

// This app, this component
import { PeerNameCache, IPeerSignalSender, IPeerSignalReciever } from './PeerInterfaces';
import { PeerLink } from './PeerLink';
import { SignalSender, SignalReciever } from './PeerSignaller';
import { WebPeerHelper } from './PeerWeb';

function uuidPart(): string {
   return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase();
};

function uuid(): string {
   return (uuidPart() + uuidPart() + "-" + uuidPart() + "-" + uuidPart() + "-" + uuidPart() + "-" + uuidPart() + uuidPart() + uuidPart());
}

var logger = new LoggerFactory().createLogger (ELoggerType.Client, true);

export class PeerConnection {

   // member variables
   private _localCallParticipation: CallParticipation;
   private _person: Person;
   private _links: PeerLink[];
   private _datalisteners: Array<Function>;
   private _isEdgeOnly: boolean;
   private _nameCache: PeerNameCache;
   private _signalSender: IPeerSignalSender;
   private _signalReciever: IPeerSignalReciever;
   private static className: string = 'PeerConnection';

   constructor(isEdge: boolean) { // If isEdge is set, does not set up links with new participants - we are reciever only
      this._localCallParticipation = null;
      this._links = new Array();
      this._datalisteners = new Array();
      this._nameCache = new PeerNameCache();
      this._signalSender = new SignalSender();
      this._signalReciever = new SignalReciever();
      this._signalReciever.onRemoteData = this.onServerEvent.bind(this);
      this._isEdgeOnly = isEdge;

      logger.logInfo(PeerConnection.className, 'constructor', 'Browser:', adapter.browserDetails);
   }

   addRemoteDataListener(fn: Function) : void {
      this._datalisteners.push(fn);
   };

   connect(facilityId: string,
      sessionId: string,
      personId: string,
      personName: string,
      personThumbnailUrl: string): void {

      // Create a unique id to this call participation by appending a UUID for the browser tab we are connecting from
      this._localCallParticipation = new CallParticipation(null, facilityId, personId, !this._isEdgeOnly, sessionId, uuid());

      // Store data on the Person who is running the app - used in data handshake & exchange
      this._person = new Person(null, personId, personName, null, personThumbnailUrl, null);

      // and connect to the server - which sends our participation details for others
      this._signalReciever.connect(this._localCallParticipation);
   }

   isConnectedToServer(): boolean {

      return this._signalReciever.isConnected();
   }

   isConnectedToLeader(): boolean {

      for (var i = 0; i < this._links.length; i++) {
         if (this._links[i].isConnectedToLeader()) {
            return true;
         }
      }
      return false;
   }

   isConnectedToMember (name: string): boolean {

      for (var i = 0; i < this._links.length; i++) {
         if (this._links[i].isConnectedToPerson(name))
            return true;
      }
      return false;
   }

   broadcast (obj) {
      var self = this;

      for (var i = 0; i < self._links.length; i++) {
         self._links[i].send(obj);
      }
      WebPeerHelper.drainSendQueue(this._signalSender);
   }

   private onServerEvent(data: IStreamable): void {

      let casting: any = data;

      switch (data.type) {
         case "CallParticipation":
            logger.logInfo(PeerConnection.className, 'onServerEvent', "CallParticipation", null);
            let participation: CallParticipation = casting;
            this.onParticipant(participation);
            break;
         case "CallOffer":
            logger.logInfo(PeerConnection.className, 'onServerEvent', "CallOffer", null);
            let offer: CallOffer = casting;
            this.onOffer(offer);
            break;
         case "CallAnswer":
            logger.logInfo(PeerConnection.className, 'onServerEvent', "CallAnswer", null);
            let answer: CallAnswer = casting;
            this.onAnswer(answer);
            break;
         case "CallIceCandidate":
            let iceCandidate: CallIceCandidate = casting;
            logger.logInfo(PeerConnection.className, 'onServerEvent', "CallIceCandidate", iceCandidate.ice);
            this.onRemoteIceCandidate(iceCandidate);
            break;
         case "CallKeepAlive": // Nothing - don't log as it creates noise in the log.
            break;
         case "CallData":
            // TODO - forward to listener
            break;
         default:
            logger.logInfo(PeerConnection.className, 'onServerEvent', "data:", data);
            break;
      }
   }

   private onParticipant(remoteParticipation: CallParticipation) : void {

      // If we are an edge node, and the caller is not a leader, dont respond.
      if (this._isEdgeOnly && !remoteParticipation.isCandidateLeader)
         return;

      // if we are an edge node and already have a leader, and this is another leader - dont respond.
      if (this._isEdgeOnly && remoteParticipation.isCandidateLeader && 
         this.isConnectedToLeader())
         return;
      
      this.createCallerLink(remoteParticipation, ETransportType.Rtc);
   }

   private createCallerLink(remoteParticipation: CallParticipation, transport: ETransportType): PeerLink {

      var link = new PeerLink(true,
         transport,
         this._localCallParticipation,
         remoteParticipation,
         this._person,
         this._nameCache,
         this._signalSender,
         this._signalReciever);

      // Hooks to pass up data
      link.onRemoteData = (ev) => {
         if (this._datalisteners) {
            for (var i = 0; i < this._datalisteners.length; i++) {
               this._datalisteners[i](ev);
            }
         }
      };

      // Hook link failure - if the peer connect fails, connect via web
      link.onRemoteFail = this.onLinkFail.bind(this);

      this._links.push(link);

      // place the call after setting up 'links' to avoid a race condition
      link.placeCall();

      return link;
   }

   private onLinkFail(link: PeerLink): void {
      var found: boolean = false;

      for (var i = 0; i < this._links.length && !found; i++) {
         if (this._links[i] === link) {
            this._links.splice(i);
            found = true;
         }
      }

      if (link.isOutbound) {
         this.createCallerLink(link.remoteCallParticipation, ETransportType.Web);
      }
   }

   private createRecieverLink(remoteParticipation: CallParticipation, transport: ETransportType): PeerLink {

      var link = new PeerLink(false,
         transport,
         this._localCallParticipation,
         remoteParticipation,
         this._person,
         this._nameCache,
         this._signalSender,
         this._signalReciever);

      // Hooks to pass up data
      link.onRemoteData = (ev) => {
         if (this._datalisteners) {
            for (var i = 0; i < this._datalisteners.length; i++) {
               this._datalisteners[i](ev);
            }
         }
      };

      // Hook link failure - if the peer connect fails, connect via web
      link.onRemoteFail = this.onLinkFail.bind(this);

      this._links.push(link);

      return link;
   }

   private onOffer(remoteOffer: CallOffer) : void {
      var self = this;

      // This loop removes glare, when we may be trying to set up calls with each other.
      for (var i = 0; i < self._links.length; i++) {
         if (self._links[i].remoteCallParticipation.equals(remoteOffer.from)) {
            // If the server restarts, other clients will try to reconect, resulting race conditions for the offer 
            // The recipient with the greater glareResolve makes the winning offer 
            if (self._localCallParticipation.glareResolve < remoteOffer.from.glareResolve) {
               self._links.splice(i); // if we lose the glareResolve test, kill the existing call & answer theirs
            } else {
               return;               // if we win, they will answer our offer, we do nothing more 
            }
         }
      }

      // Setup links befoe answering the call to remove race conditions from asynchronous arrival
      let link = this.createRecieverLink(remoteOffer.from, remoteOffer.transport);
      link.answerCall(remoteOffer);
   }

   private onAnswer(remoteAnswer: CallAnswer) : void {
      var self = this;
      var found = false;

      for (var i = 0; i < self._links.length; i++) {
         if (self._links[i].remoteCallParticipation.equals(remoteAnswer.from)) {
            self._links[i].handleAnswer(remoteAnswer);
            found = true;
            break;
         }
      }
      if (!found)
         logger.logError(PeerConnection.className, 'onAnswer', "cannot find target:", remoteAnswer);
   }

   private onRemoteIceCandidate(remoteIceCandidate: CallIceCandidate) : void {
      var self = this;
      var found : boolean = false;

      for (var i = 0; i < self._links.length && !found; i++) {
         if (self._links[i].remoteCallParticipation.equals(remoteIceCandidate.from)) {
            found = true;
         }
      }

      if (!found) {
         this.createRecieverLink(remoteIceCandidate.from, ETransportType.Rtc);
      }

      found = false;

      // Ice candidate messages can be sent while we are still resolving glare - e.g. we are calling each other, and we killed our side while we have
      // incoming messages still pending
      // So fail silently if we get unexpected Ice candidate messages 
      for (var i = 0; i < self._links.length; i++) {
         if (self._links[i].remoteCallParticipation.equals(remoteIceCandidate.from)) {
            if (remoteIceCandidate.outbound) { 
               self._links[i].handleIceCandidate(remoteIceCandidate);
            }
            found = true;
            break;
         }
      }
      if (!found) {
         logger.logError(PeerConnection.className, 'onRemoteIceCandidate', "Remote:", remoteIceCandidate);
         logger.logError(PeerConnection.className, 'onRemoteIceCandidate', "Links:", self._links);
      }
   }
}

