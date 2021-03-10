/*! Copyright TXPCo, 2020, 2021 */
// Modules in the Peer architecture:
// PeerConnection : overall orchestration & interface to the UI.
// PeerFactory - creates Rtc or Web versions as necessary to meet a request for a PeerCaller or PeerSender. 
// PeerInterfaces - defines abstract interfaces for PeerCaller, PeerSender, PeerSignalsender, PeerSignalReciever etc 
// PeerLink - contains a connection, plus logic to bridge the send/receieve differences, and depends only on abstract classes. 
// PeerRtc - contains concrete implementations of PeerCaller and PeerSender, send and recieve data via WebRTC
// PeerSignaller - contains an implementation of the PeerSignalSender & PeerSignalReciever interfaces.
// PeerWeb  - contains concrete implementations of PeerCaller and PeerSender, sends and recoeved data via the node.js server

// RTC References:
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
// https://medium.com/xamarin-webrtc/webrtc-signaling-server-dc6e38aaefba 
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation

// External libraries
import axios from 'axios';

// This app, this library
import { Person } from './Person';
import { Queue } from './Queue';
import { LoggerFactory, ELoggerType } from './Logger';
import { StreamableTypes } from './StreamableTypes';
import { IStreamable } from './Streamable';
import { ETransportType, CallParticipation, CallOffer, CallAnswer, CallIceCandidate, CallData, CallDataBatched } from './Call';
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
   remotePerson(): Person | undefined {
      return this.peerHelp.remotePerson;
   }
   remotePersonIs(name: string): boolean {
      if (this.peerHelp.remotePerson) {
         return (this.peerHelp.remotePerson.name === name);
      } else {
         return false;
      }
   }
   isConnected(): boolean {
      return this.peerHelp.isChannelConnected;
   }

   // Override this for data from notifications 
   onRemoteData: ((ev: IStreamable) => void) = function (ev) { };
   onRemoteFail: (() => void) = function () { };

   placeCall(): void {
      this.peerHelp.placeCall();
   }

   handleAnswer(answer: CallAnswer): void {
      this.peerHelp.handleAnswer(answer);
   }

   handleIceCandidate(ice: CallIceCandidate): void {
      // No-op for web connection
   }

   handleRemoteData(data: CallData): void {
      this.peerHelp.handleRemoteData(data);
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
   remotePerson(): Person | undefined {
      return this.peerHelp.remotePerson;
   }
   remotePersonIs(name: string): boolean {
      if (this.peerHelp.remotePerson) {
         return (this.peerHelp.remotePerson.name === name);
      } else {
         return false;
      }
   }
   isConnected(): boolean {
      return this.peerHelp.isChannelConnected;
   }

   // Override these for data from notifications 
   onRemoteData: ((ev: IStreamable) => void) = function (ev) { };
   onRemoteFail: (() => void) = function () { };

   answerCall(offer: CallOffer): void {

      this.peerHelp.answerCall(offer);
   }

   handleIceCandidate(ice: CallIceCandidate): void {
      // No-op for web connection
   }

   handleRemoteData(data: CallData): void {
      this.peerHelp.handleRemoteData(data);
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

export class WebPeerHelper {

   // member variables
   private _localCallParticipation: CallParticipation;
   private _remoteCallParticipation: CallParticipation;
   private _localPerson: Person;
   private _remotePerson: Person | undefined;
   private _isChannelConnected: boolean;
   private _nameCache: PeerNameCache;
   private _signaller: IPeerSignalSender;
   private _types: StreamableTypes;
   private static className: string = 'WebPeerHelper';

   private static _sendQueue: Queue<IStreamable> = new Queue<IStreamable> ();
   private static _dataForBatch: IStreamable = undefined;
   private static _recipents: Array<CallParticipation> = new Array<CallParticipation>();
   private static _sender: CallParticipation = undefined;

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
      this._types = new StreamableTypes();

      this._isChannelConnected = false;
   }

   // Override these for notifications 
   onRemoteData: ((ev: IStreamable) => void) = function (ev) { };
   onRemoteFail: (() => void) = function () { };

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
   get remotePerson(): Person | undefined {
      return this._remotePerson;
   }
   get isChannelConnected(): boolean {
      return this._isChannelConnected;
   }

   // Connection handling
   //////////

   placeCall(): void {
      let offer = new CallOffer(this._localCallParticipation, this._remoteCallParticipation, "Web", ETransportType.Web);
      this._signaller.sendOffer(offer);
   }

   handleAnswer(answer: CallAnswer): void {
      this._isChannelConnected = true;

      // Send the local person to start the application handshake
      this.send(this._localPerson);
      WebPeerHelper.drainSendQueue(this._signaller);
   }

   answerCall(remoteOffer: CallOffer): void {
      let answer = new CallAnswer (this._localCallParticipation, this._remoteCallParticipation, "Web", ETransportType.Web);
      this._signaller.sendAnswer(answer);
      this._isChannelConnected = true;

      // Send the local person to start the application handshake
      this.send(this._localPerson);
      WebPeerHelper.drainSendQueue(this._signaller);
   }

   close(): void {
      // TODO
   }

   send(obj: IStreamable) : void {

      if (!WebPeerHelper._dataForBatch) {
         // first call - just save the item and pass back control
         WebPeerHelper._dataForBatch = obj;
         WebPeerHelper._sender = this._localCallParticipation;
         WebPeerHelper._recipents.push(this._remoteCallParticipation);

         return;
      } else {
         if (obj === WebPeerHelper._dataForBatch && this._localCallParticipation === WebPeerHelper._sender) {
            // This case is a repeated re-send of the same item to different recipieents -> save the recipients
            WebPeerHelper._recipents.push(this._remoteCallParticipation);
         }
         else {
            // This case we have a new item being sent - flush the queue and restart
            WebPeerHelper.drainSendQueue(this._signaller);

            // Then save the new item and pass back control
            WebPeerHelper._dataForBatch = obj;
            WebPeerHelper._sender = this._localCallParticipation;
            WebPeerHelper._recipents.push(this._remoteCallParticipation);
         }
         WebPeerHelper._dataForBatch = obj;
      }
   }


   handleRemoteData(data: CallData): void {
      this.onRecieveMessage (data);
   }

   static drainSendQueue(signaller: IPeerSignalSender) {

      if (WebPeerHelper._dataForBatch) {
         // Take a copy of the data to send as the send is anychronous & if new items come in we need to correctly accumulate them
         let callData = new CallDataBatched(WebPeerHelper._sender, WebPeerHelper._recipents.map((x) => x), WebPeerHelper._dataForBatch);

         // Reset accumulated data
         WebPeerHelper._dataForBatch = undefined;
         WebPeerHelper._sender = undefined;
         WebPeerHelper._recipents = new Array<CallParticipation>();

         // Send our data.
         // we put it on a queue first as new data can arrive and get re-queued while we are sending to the server
         WebPeerHelper._sendQueue.enqueue(callData);
      }

      while (!WebPeerHelper._sendQueue.isEmpty()) {
         signaller.sendData(WebPeerHelper._sendQueue.dequeue());
      }
   }

   private onRecieveMessage(data: CallData) {
 
      var remoteCallData = data.data;

      // Store the person we are talking to - allows tracking in the UI later
      if (remoteCallData.type === Person.__type) {
         var person: Person = remoteCallData as any;

         // Store a unique derivation of name in case a person join multiple times
         this._remotePerson = new Person(person.id,
            person.externalId,
            this._nameCache.addReturnUnique(person.name),
            person.email,
            person.thumbnailUrl,
            person.lastAuthCode);

         if (this.onRemoteData) {
            this.onRemoteData(remoteCallData);
         }
      } else {

         if (this.onRemoteData) {
            this.onRemoteData(remoteCallData);
         }
      }
   }
}