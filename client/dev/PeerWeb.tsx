/*! Copyright TXPCo, 2020, 2021 */
// Modules in the Peer architecture:
// PeerConnection : overall orchestration & interface to the UI. 
// PeerInterfaces - defines abstract interfaces for PeerCaller, PeerSender, PeerSignalsender, PeerSignalReciever etc 
// PeerLink - contains a connection, plus logic to bridge the send/receieve differences, and depends only on abstract classes. 
// PeerRtc - contains concrete implementations of PeerCaller and PeerSender. 
// PeerSignaller - contains an implementation of the PeerSignalSender & PeerSignalReciever interfaces.

// RTC References:
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
// https://medium.com/xamarin-webrtc/webrtc-signaling-server-dc6e38aaefba 
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation

// External libraries
import axios from 'axios';

// This app, other components
import { Person } from '../../core/dev/Person';
import { Queue } from '../../core/dev/Queue';
import { LoggerFactory, ELoggerType } from '../../core/dev/Logger';
import { TypeRegistry } from '../../core/dev/Types';
import { IStreamable } from '../../core/dev/Streamable';
import { CallParticipation, CallOffer, CallAnswer, CallIceCandidate } from '../../core/dev/Call';

// This app, this component
import { EPeerConnectionType, IPeerSignalSender, IPeerCaller, IPeerReciever, PeerNameCache } from './PeerInterfaces'

var logger = new LoggerFactory().createLogger(ELoggerType.Client, true);


export class PeerCallerWeb implements IPeerCaller {
   // member variables
   private peerHelp: WebPeerHelper;

   constructor(localCallParticipation: CallParticipation,
      remoteCallParticipation: CallParticipation,
      person: Person,
      nameCache: PeerNameCache,
      signaller: IPeerSignalSender) {

      this.peerHelp = new WebPeerHelper(localCallParticipation,
         remoteCallParticipation,
         person, nameCache, signaller);

      // Hook to pass any data up the chain
      this.peerHelp.onRemoteData = this.onRemoteDataInner.bind(this);
      this.peerHelp.onRemoteFail = this.onRemoteFailInner.bind(this);
   }

   /**
   * set of 'getters' for private variables
   */
   localCallParticipation(): CallParticipation {
      return this.peerHelp.localCallParticipation;
   }
   remoteCallParticipation(): CallParticipation {
      return this.peerHelp.remoteCallParticipation;
   }
   localPerson(): Person {
      return this.peerHelp.localPerson;
   }
   remotePerson(): Person {
      return this.peerHelp.remotePerson;
   }
   isConnected(): boolean {
      return this.peerHelp.isChannelConnected;
   }

   // Override this for data from notifications 
   onRemoteData: ((this: PeerCallerWeb, ev: IStreamable) => any) | null;
   onRemoteFail: ((this: PeerCallerWeb) => void) | null;

   placeCall(): void {
      this.peerHelp.placeCall();
   }

   handleAnswer(answer: CallAnswer): void {
      this.peerHelp.handleAnswer(answer);
   }

   handleIceCandidate(ice: CallIceCandidate): void {
      // No-op for web connection
   }

   send(obj: IStreamable): void {
      this.peerHelp.send(obj);
   }

   close(): void {
      this.peerHelp.close();
   }

   private onRemoteDataInner(ev: IStreamable): void {

      if (this.onRemoteData) {
         this.onRemoteData(ev);
      }
   }
   private onRemoteFailInner(): void {

      if (this.onRemoteFail) {
         this.onRemoteFail();
      }
   }
}

export class PeerRecieverWeb implements IPeerReciever {
   // member variables
   private peerHelp: WebPeerHelper;

   constructor(localCallParticipation: CallParticipation,
      remoteCallParticipation: CallParticipation,
      person: Person,
      nameCache: PeerNameCache,
      signaller: IPeerSignalSender) {

      this.peerHelp = new WebPeerHelper(localCallParticipation,
         remoteCallParticipation,
         person, nameCache,
         signaller);

      // Hook to pass any data up the chain
      this.peerHelp.onRemoteData = this.onRemoteDataInner.bind(this);
      this.peerHelp.onRemoteFail = this.onRemoteFailInner.bind(this);
   }

   /**
   * set of 'getters' for private variables
   */
   localCallParticipation(): CallParticipation {
      return this.peerHelp.localCallParticipation;
   }
   remoteCallParticipation(): CallParticipation {
      return this.peerHelp.remoteCallParticipation;
   }
   localPerson(): Person {
      return this.peerHelp.localPerson;
   }
   remotePerson(): Person {
      return this.peerHelp.remotePerson;
   }
   isConnected(): boolean {
      return this.peerHelp.isChannelConnected;
   }

   // Override this for data for notifications 
   onRemoteData: ((this: PeerRecieverWeb, ev: IStreamable) => void) | null;
   onRemoteFail: ((this: PeerRecieverWeb) => void) | null;

   answerCall(offer: CallOffer): void {

      this.peerHelp.answerCall(offer);
   }

   handleIceCandidate(ice: CallIceCandidate): void {
      // No-op for web connection
   }

   send(obj: IStreamable): void {
      this.peerHelp.send(obj);
   }

   close(): void {
      this.peerHelp.close();
   }

   private onRemoteDataInner(ev: IStreamable): void {

      if (this.onRemoteData) {
         this.onRemoteData(ev);
      }
   }

   private onRemoteFailInner(): void {

      if (this.onRemoteFail) {
         this.onRemoteFail();
      }
   }
}

class WebPeerHelper {

   // member variables
   private _localCallParticipation: CallParticipation;
   private _remoteCallParticipation: CallParticipation;
   private _localPerson: Person;
   private _remotePerson: Person;
   private _isChannelConnected: boolean;
   private _nameCache: PeerNameCache;
   private _signaller: IPeerSignalSender;
   private _types: TypeRegistry;
   private static className: string = 'WebPeerHelper';

   private _sendQueue: Queue<IStreamable>;

   constructor(localCallParticipation: CallParticipation,
      remoteCallParticipation: CallParticipation,
      person: Person,
      nameCache: PeerNameCache,
      signaller: IPeerSignalSender
   ) {
      this._localCallParticipation = localCallParticipation;
      this._remoteCallParticipation = remoteCallParticipation;
      this._localPerson = person;
      this._nameCache = nameCache;
      this._signaller = signaller;
      this._types = new TypeRegistry();

      this._isChannelConnected = false;
   }

   // Override these for notifications - TODO - see top of file
   onRemoteData: ((this: WebPeerHelper, ev: Event) => void) | null;
   onRemoteFail: ((this: WebPeerHelper) => void) | null;

   /**
   * set of 'getters' & some 'setters' for private variables
   */
   get localCallParticipation(): CallParticipation {
      return this._localCallParticipation;
   }
   get remoteCallParticipation(): CallParticipation {
      return this._remoteCallParticipation;
   }
   get localPerson(): Person {
      return this._localPerson;
   }
   get remotePerson(): Person {
      return this._remotePerson;
   }
   get isChannelConnected(): boolean {
      return this._isChannelConnected;
   }

   // Connection handling
   //////////


   placeCall (): void {
      // no-op
   }

   handleAnswer(answer: CallAnswer): void {
       // no-op
   }

   answerCall(remoteOffer: CallOffer): void {
      // no-op
   }

   close(): void {
      // TODO
   }

   send(obj: IStreamable) : void {
      // TODO - send logic goes here
   }

   private onRecieveMessage(ev: Event) {
      // Too noisy to keep this on 
      // logger.logInfo('RtcCaller', 'onrecievechannelmessage', "message:", msg.data);

      var ev2: any = ev;

      var remoteCallData = this._types.reviveFromJSON(ev2.data);

      // Store the person we are talking to - allows tracking in the UI later
      if (remoteCallData.type === Person.__type) {
         var person: Person = remoteCallData;

         // Store a unique derivation of name in case a person join multiple times
         this._remotePerson = new Person(person.id,
            person.externalId,
            this._nameCache.addReturnUnique(person.name),
            person.email,
            person.thumbnailUrl,
            person.lastAuthCode);

         if (this.onRemoteData) {
            this.onRemoteData(this._remotePerson as any);
         }
      } else {

         if (this.onRemoteData) {
            this.onRemoteData(remoteCallData);
         }
      }
   }
}