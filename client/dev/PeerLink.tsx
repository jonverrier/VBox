/*! Copyright TXPCo, 2020, 2021 */
// Modules in the Peer architecture:
// PeerConnection : overall orchestration & interface to the UI.
// PeerFactory - creates Rtc or Web versions as necessary to meet a request for a PeerCaller or PeerSender. 
// PeerInterfaces - defines abstract interfaces for PeerCaller, PeerSender, PeerSignalsender, PeerSignalReciever etc 
// PeerLink - contains a connection, plus logic to bridge the send/receieve differences, and depends only on abstract classes. 
// PeerRtc - contains concrete implementations of PeerCaller and PeerSender, send and recieve data via WebRTC
// PeerSignaller - contains an implementation of the PeerSignalSender & PeerSignalReciever interfaces.
// PeerWeb  - contains concrete implementations of PeerCaller and PeerSender, sends and recoeved data via the node.js server

// External libraries
import * as React from 'react';
 
// This app, external components
import { Person } from '../../core/dev/Person';
import { ETransportType, CallParticipation, CallOffer, CallAnswer, CallIceCandidate, CallData } from '../../core/dev/Call';
import { IStreamable } from '../../core/dev/Streamable';
import { LoggerFactory, ELoggerType } from '../../core/dev/Logger';

// This app, this component
import { EPeerConnectionType, IPeerCaller, IPeerReciever,  PeerNameCache, IPeerSignalSender, IPeerSignalReciever } from './PeerInterfaces';
import { PeerFactory } from './PeerFactory';

function uuidPart(): string {
   return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase();
};

function uuid(): string {
   return (uuidPart() + uuidPart() + "-" + uuidPart() + "-" + uuidPart() + "-" + uuidPart() + "-" + uuidPart() + uuidPart() + uuidPart());
}

var logger = new LoggerFactory().createLogger (ELoggerType.Client, true);

export class PeerLink {
   // member variables
   private _outbound: boolean;
   private _transport: ETransportType;
   private _localCallParticipation: CallParticipation;
   private _remoteCallParticipation: CallParticipation;
   private _person: Person;
   private _peerCaller: IPeerCaller;
   private _peerReciever: IPeerReciever;
   private static className: string = 'PeerLink';

   // Override this to get data from the link
   onRemoteData: ((this: PeerLink, ev: IStreamable) => any) | null;
   onRemoteFail: ((this: PeerLink, link: PeerLink) => void) | null;

   constructor(outbound: boolean,
      transport: ETransportType,
      localCallParticipation: CallParticipation,
      remoteCallParticipation: CallParticipation,
      person: Person,
      nameCache: PeerNameCache,
      signalSender: IPeerSignalSender,
      signalReciever: IPeerSignalReciever) {

      this._outbound = outbound;
      this._localCallParticipation = localCallParticipation;
      this._remoteCallParticipation = remoteCallParticipation;
      this._person = person;
      this._transport = transport;

      let factory = new PeerFactory();
      if (outbound) {

         this._peerCaller = factory.createCallerConnection(EPeerConnectionType.Caller,
            transport,
            localCallParticipation,
            remoteCallParticipation,
            person,
            nameCache,
            signalSender,
            signalReciever);

         this._peerCaller.onRemoteData = this.onRemoteDataInner.bind(this);
         this._peerCaller.onRemoteFail = this.onRemoteFailInner.bind(this);

      } else {

         this._peerReciever = factory.createRecieverConnection(EPeerConnectionType.Reciever,
            transport,
            localCallParticipation,
            remoteCallParticipation,
            person,
            nameCache,
            signalSender,
            signalReciever);

         this._peerReciever.onRemoteData = this.onRemoteDataInner.bind(this);
         this._peerReciever.onRemoteFail = this.onRemoteFailInner.bind(this);
      }
   }

   get remoteCallParticipation(): CallParticipation {
      return this._remoteCallParticipation;
   }

   get localCallParticipation(): CallParticipation {
      return this._localCallParticipation;
   }

   get person (): Person {
      return this._person;
   }

   get isOutbound(): boolean {
      return this._outbound;
   }

   get transport(): ETransportType {
      return this._transport;
   }

   placeCall(): void {
      if (this._outbound && this._peerCaller)
         this._peerCaller.placeCall();
      else
         logger.logError(PeerLink.className, 'placeCall', "Recieved placeCall but do not have caller:", null);
   }

   answerCall(offer: CallOffer): void {
      if (!this._outbound && this._peerReciever)
         this._peerReciever.answerCall(offer);
      else
         logger.logError(PeerLink.className, 'answerCall', "Recieved offer but do not have reciever:", offer);
   }

   handleAnswer(answer: CallAnswer): void {
      if (this._outbound && this._peerCaller)
         this._peerCaller.handleAnswer(answer);
      else
         logger.logError(PeerLink.className, 'handleAnswer', "Recieved answer but do not have caller:", answer);
   }

   handleIceCandidate(ice: CallIceCandidate): void {
      // Ice candidate messages can be sent while we are still resolving glare - e.g. we are calling each other, and we killed our side while we have
      // incoming messages still pending
      // So fail silently if we get unexpected Ice candidate messages 
      if (this._outbound) {
         if (this._peerCaller)
            this._peerCaller.handleIceCandidate(ice);
         // else silent fail
      } else {
         if (this._peerReciever)
            this._peerReciever.handleIceCandidate(ice);
         // else silent fail
      }
   }

   handleRemoteData (data: CallData): void {
      if (this._outbound) {
         if (this._peerCaller)
            this._peerCaller.handleRemoteData(data);
         // else silent fail
      } else {
         if (this._peerReciever)
            this._peerReciever.handleRemoteData(data);
         // else silent fail
      }
   }

   send(obj) : void {
      if (this._outbound && this._peerCaller)
         this._peerCaller.send(obj);
      if (!this._outbound && this._peerReciever)
         this._peerReciever.send(obj);
   }

   isConnectedToLeader(): boolean {
      if (!this._outbound && this._peerReciever && this._peerReciever.remotePerson()
         && this._peerReciever.remoteCallParticipation().isCandidateLeader
         && this._peerReciever.isConnected()) {
         return true;
      }
      if (this._outbound && this._peerCaller && this._peerCaller.remotePerson()
         && this._peerCaller.remoteCallParticipation().isCandidateLeader
         && this._peerCaller.isConnected()) {
         return true;
      }

      return false;
   }

   isConnectedToPerson (name: string): boolean {
      if (!this._outbound && this._peerReciever && this._peerReciever.remotePerson()
         && this._peerReciever.remotePerson().name === name
         && this._peerReciever.isConnected()) {
         return true;
      }
      if (this._outbound && this._peerCaller && this._peerCaller.remotePerson()
         && this._peerCaller.remotePerson().name === name
         && this._peerCaller.isConnected()) {
         return true;
      }

      return false;
   }

   private onRemoteDataInner(ev: IStreamable): void {
      if (this.onRemoteData)
         this.onRemoteData(ev);
   }

   private onRemoteFailInner(): void {
      if (this.onRemoteFail)
         this.onRemoteFail(this);
   }
}

