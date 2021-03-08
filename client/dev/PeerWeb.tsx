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

// This app, other components
import { Person } from '../../core/dev/Person';
import { Queue } from '../../core/dev/Queue';
import { LoggerFactory, ELoggerType } from '../../core/dev/Logger';
import { StreamableTypes } from '../../core/dev/StreamableTypes';
import { IStreamable } from '../../core/dev/Streamable';
import { ETransportType, CallParticipation, CallOffer, CallAnswer, CallIceCandidate, CallData, CallDataBatched } from '../../core/dev/Call';

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
   private _remotePerson: Person;
   private _isChannelConnected: boolean;
   private _nameCache: PeerNameCache;
   private _signaller: IPeerSignalSender;
   private _types: StreamableTypes;
   private static className: string = 'WebPeerHelper';

   private static _sendQueue: Queue<IStreamable> = new Queue<IStreamable> ();
   private static _dataForBatch: IStreamable = null;
   private static _recipents: Array<CallParticipation> = new Array<CallParticipation>();
   private static _sender: CallParticipation = null;

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

   placeCall(): void {
      let offer = new CallOffer(null, this._localCallParticipation, this._remoteCallParticipation, "Web", ETransportType.Web);
      this._signaller.sendOffer(offer);
   }

   handleAnswer(answer: CallAnswer): void {
      this._isChannelConnected = true;
   }

   answerCall(remoteOffer: CallOffer): void {
      let answer = new CallAnswer (null, this._localCallParticipation, this._remoteCallParticipation, "Web", ETransportType.Web);
      this._signaller.sendAnswer(answer);
      this._isChannelConnected = true;
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
         let callData = new CallDataBatched(null, WebPeerHelper._sender, WebPeerHelper._recipents.map((x) => x), WebPeerHelper._dataForBatch);

         // Reset accumulated data
         WebPeerHelper._dataForBatch = null;
         WebPeerHelper._sender = null;
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
      // Too noisy to keep this on 
      // logger.logInfo('RtcCaller', 'onrecievechannelmessage', "message:", msg.data);

      var remoteCallData = data;

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
            var ev: Event = new Event('remotecalldata');
            (ev as any).data = remoteCallData;
            this.onRemoteData(ev);
         }
      } else {

         if (this.onRemoteData) {
            var ev: Event = new Event('remotecalldata');
            (ev as any).data = remoteCallData;
            this.onRemoteData(ev);
         }
      }
   }
}