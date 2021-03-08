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
import { ETransportType, CallParticipation, CallOffer, CallAnswer, CallIceCandidate, CallData } from '../../core/dev/Call';

// This app, this component
import { EPeerConnectionType, IPeerSignalSender, IPeerCaller, IPeerReciever, PeerNameCache, IPeerSignalReciever } from './PeerInterfaces'

var logger = new LoggerFactory().createLogger(ELoggerType.Client, true);

export enum ERtcConfigurationType {
   StunOnly,
   TurnOnly,
   StunThenTurn,
   Nothing // this is used to force fallback to web for testing
}

// Set this to control connection scope
const rtcConfigType = ERtcConfigurationType.StunThenTurn;

export class RtcConfigFactory {
   constructor() {
   }

   createConfig(configType: ERtcConfigurationType): RTCConfiguration {

      switch (configType) {
         case ERtcConfigurationType.Nothing:
            let noConfiguration = {
               iceServers: []
            };
            return noConfiguration;

         case ERtcConfigurationType.StunOnly:
            let stunConfiguration = {
               iceServers: [{
                  "urls": "stun:stun.l.google.com:19302"
               },
               {
                  "urls": "stun:stun1.l.google.com:19302"
               }]
            };
            return stunConfiguration;

         case ERtcConfigurationType.TurnOnly:
            let turnConfiguration = {
               iceServers: [{
                  "urls": "turn:ec2-18-216-213-192.us-east-2.compute.amazonaws.com:3480",
                  username: 'ubuntu',
                  credential: '1wtutona'
               }
               ]
            };
            return turnConfiguration;

         case ERtcConfigurationType.StunThenTurn:
         default:
            let defaultConfiguration = {
               iceServers: [{
                  "urls": "stun:stun.l.google.com:19302"
               },
               {
                  "urls": "stun:stun1.l.google.com:19302"
               } /* 2021/3/5 - this leads to log timeouts ... ,
               {
                  "urls": "turn:ec2-18-216-213-192.us-east-2.compute.amazonaws.com:3480",
                  username: 'ubuntu',
                  credential: '1wtutona'
               }*/
               ] 
            };
            return defaultConfiguration;
      }
   }
}

export class PeerCallerRtc implements IPeerCaller {
   // member variables
   private peerHelp: RtcPeerHelper;

   constructor(localCallParticipation: CallParticipation,
      remoteCallParticipation: CallParticipation,
      person: Person,
      nameCache: PeerNameCache,
      signaller: IPeerSignalSender) {

      this.peerHelp = new RtcPeerHelper(localCallParticipation,
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
   onRemoteData: ((this: PeerCallerRtc, ev: IStreamable) => any) | null;
   onRemoteFail: ((this: PeerCallerRtc) => void) | null;

   placeCall(): void {

      this.peerHelp.createConnection(EPeerConnectionType.Caller, "Caller");
   }

   handleAnswer(answer: CallAnswer): void {
      this.peerHelp.handleAnswer(answer);
   }

   handleIceCandidate(ice: CallIceCandidate): void {
      this.peerHelp.handleIceCandidate(ice);
   }

   handleRemoteData(data: CallData) : void {
      // No-op - we dont expect to recieve data from fallback channel
      // TODO - make an assert() fail??
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

export class PeerRecieverRtc implements IPeerReciever {
   // member variables
   private peerHelp: RtcPeerHelper;

   constructor(localCallParticipation: CallParticipation,
      remoteCallParticipation: CallParticipation,
      person: Person,
      nameCache: PeerNameCache,
      signaller: IPeerSignalSender) {

      this.peerHelp = new RtcPeerHelper(localCallParticipation,
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
   onRemoteData: ((this: PeerRecieverRtc, ev: IStreamable) => void) | null;
   onRemoteFail: ((this: PeerRecieverRtc) => void) | null;

   answerCall(offer: CallOffer): void {

      this.peerHelp.createConnection(EPeerConnectionType.Reciever, "Reciever");

      this.peerHelp.answerCall(offer);
   }

   handleIceCandidate(ice: CallIceCandidate): void {
      this.peerHelp.handleIceCandidate(ice);
   }

   handleRemoteData(data: CallData): void {
      // No-op - we dont expect to recieve data from fallback channel
      // TODO - make an assert() fail??
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

class RtcPeerHelper {

   // member variables
   private _localCallParticipation: CallParticipation;
   private _remoteCallParticipation: CallParticipation;
   private _localPerson: Person;
   private _remotePerson: Person;
   private _isChannelConnected: boolean;
   private _isIceConnected: boolean;
   private _nameCache: PeerNameCache;
   private _signaller: IPeerSignalSender;
   private _types: StreamableTypes;
   private static className: string = 'RtcPeerHelper';

   private _connection: RTCPeerConnection;
   private _iceQueue: Queue<any>;

   private _sendChannel: RTCDataChannel;
   private _recieveChannel: RTCDataChannel;
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
      this._types = new StreamableTypes();

      this._isChannelConnected = false;
      this._sendChannel = null;
      this._recieveChannel = null;
      this._sendQueue = new Queue<IStreamable>();
      this._connection = null;
      this._iceQueue = new Queue<CallIceCandidate>();
   }

   // Override these for notifications - TODO - see top of file
   onRemoteData: ((this: RtcPeerHelper, ev: Event) => void) | null;
   onRemoteFail: ((this: RtcPeerHelper) => void) | null;

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
   get isIceConnected(): boolean {
      return this._isIceConnected;
   }

   // Connection handling
   //////////
   createConnection(type: EPeerConnectionType, channelName: string) : void {
      let factory = new RtcConfigFactory();
      let configuration = factory.createConfig(rtcConfigType);

      this._connection = new RTCPeerConnection(configuration);
      this._connection.onicecandidate = (ice) => {
         this.onIceCandidate(ice.candidate, this.remoteCallParticipation);
      };

      if (type === EPeerConnectionType.Caller) {
         this._connection.onnegotiationneeded = (ev) => { this.onNegotiationNeededCaller.bind(this)(ev); };
      } else {
         this._connection.onnegotiationneeded = (ev) => { this.onNegotiationNeededReciever.bind(this)(ev); };
      }

      this._connection.ondatachannel = (ev) => { this.onRecieveDataChannel.bind(this)(ev.channel) };
      this._connection.oniceconnectionstatechange = (ev) => { this.onIceConnectionStateChange.bind(this) (ev, this._connection); };
      this._connection.onconnectionstatechange = (ev) => { this.onConnectionStateChange.bind(this) (ev, this._connection); };
      this._connection.onicecandidateerror = (ev) => { this.onIceCandidateError.bind(this)(ev); };

      this.createSendChannel(this._connection, channelName);
   }

   private onIceCandidate(candidate, to: CallParticipation) : void {

      // Send our call ICE candidate in
      var callIceCandidate = new CallIceCandidate(null, this.localCallParticipation, to, candidate, true);
      this._signaller.sendIceCandidate(callIceCandidate);
   }

   private onNegotiationNeededCaller (ev: Event) : void {
      var self = this;

      logger.logInfo(RtcPeerHelper.className, 'onNegotiationNeededCaller', 'Event:', ev);

      // ICE enumeration does not start until we create a local description, so call createOffer() to kick this off
      this._connection.createOffer({ iceRestart: true })
         .then(offer => self._connection.setLocalDescription(offer))
         .then(() => {
            // Send our call offer data in
            logger.logInfo(RtcPeerHelper.className, 'onNegotiationNeededCaller', 'Posting offer', null);
            var callOffer = new CallOffer(null, self.localCallParticipation, self.remoteCallParticipation, self._connection.localDescription, ETransportType.Rtc);
            self._signaller.sendOffer(callOffer);
         })
   };

   private onNegotiationNeededReciever (ev: Event) {

      logger.logInfo(RtcPeerHelper.className, 'onNegotiationNeededReciever', 'Event:', ev);
   };

   private onConnectionStateChange(ev: Event, pc: RTCPeerConnection): void {

      logger.logInfo(RtcPeerHelper.className, 'onConnectionStateChange', 'State:', pc.connectionState);

      switch (pc.connectionState) {
         case "connected":
            break;
         case "disconnected":
            break;
         case "failed":
            // The connection has been closed or failed
            this._isChannelConnected = false;
            if (this.onRemoteFail)
               this.onRemoteFail();
            break;
         case "closed":
            // The connection has been closed or failed
            this._isChannelConnected = false;
            break;
      }
   }

   handleIceCandidate(ice: CallIceCandidate): void {
      // ICE candidates can arrive before call offer/answer
      // If we have not yet set remoteDescription, queue the iceCandidate for later
      if (!this._connection
         || !this._connection.remoteDescription
         || !this._connection.remoteDescription.type) {
         this._iceQueue.enqueue(ice);
         return;
      }

      if (ice.ice) {
         if (!this.isIceConnected) { // dont add another candidate if we are connected
            this._connection.addIceCandidate(new RTCIceCandidate(ice.ice))
               .catch(e => {
                  // TODO - analyse error paths
                  logger.logError(RtcPeerHelper.className, 'handleIceCandidate', "error:", e);
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

   handleAnswer(answer: CallAnswer): void {
      var self = this;

      if (!this._isIceConnected) {
         this._connection.setRemoteDescription(new RTCSessionDescription(answer.answer))
            .then(() => {
               logger.logInfo(RtcPeerHelper.className, 'handleAnswer', 'succeeded', null);

               // Dequeue any iceCandidates that were enqueued while we had not set remoteDescription
               while (!self._iceQueue.isEmpty()) {
                  self.handleIceCandidate.bind(self)(self._iceQueue.dequeue());
               }
            })
            .catch(e => {

               logger.logError(RtcPeerHelper.className, 'handleAnswer', 'error:', e);
            });
      }
   }

   answerCall(remoteOffer: CallOffer): void {

      let self = this;

      this._connection.setRemoteDescription(new RTCSessionDescription(remoteOffer.offer))
         .then(() => self._connection.createAnswer({ iceRestart: true }))
         .then((answer) => self._connection.setLocalDescription(answer))
         .then(() => {
            logger.logInfo(RtcPeerHelper.className, 'answerCall', 'Posting answer', null);
            // Send our call answer data in
            var callAnswer = new CallAnswer(null, self.localCallParticipation, remoteOffer.from, self._connection.localDescription, ETransportType.Rtc);
            this._signaller.sendAnswer(callAnswer)
               .then((response) => {
                  // Dequeue any iceCandidates that were enqueued while we had not set remoteDescription
                  while (!self._iceQueue.isEmpty()) {
                     self.handleIceCandidate.bind(self)(self._iceQueue.dequeue())
                  }
               })
         });
   }

   close(): void {
      this._connection.close();
   }

   // Send channel handling
   //////////
   private createSendChannel(connection: RTCPeerConnection, name: string): void {

      if (this._sendChannel) {
         this._sendChannel.close();
      }

      this._sendChannel = connection.createDataChannel(name);

      this._sendChannel.onopen = (ev) => { this.onSendChannelOpen(ev, this._sendChannel); };
      this._sendChannel.onerror = this.onSendChannelError.bind(this);
      this._sendChannel.onmessage = this.onSendChannelMessage.bind(this);
      this._sendChannel.onclose = this.onSendChannelClose.bind(this);
   }

   send(obj: IStreamable) : void {
      if (this._sendChannel && this._sendChannel.readyState === 'open') {
         // Dequeue any messages that were enqueued while we were not ready
         while (!this._sendQueue.isEmpty()) {
            this._sendChannel.send(JSON.stringify(this._sendQueue.dequeue()));
         }
         this._sendChannel.send(JSON.stringify(obj));
      } else {
         this._sendQueue.enqueue(obj);
      }
   }

   private onSendChannelOpen(ev: Event, dc: RTCDataChannel) : void {

      this._isChannelConnected = true;

      try {
         // By convention, new joiners broadcast a 'Person' object to peers
         dc.send(JSON.stringify(this.localPerson));
      }
      catch (e) {
         logger.logError(RtcPeerHelper.className, 'onSendChannelOpen', "error:", e);
      }
   }

   private onSendChannelMessage(msg) {
      logger.logInfo(RtcPeerHelper.className, 'onSendChannelMessage', "message:", msg.data);
   }

   private onSendChannelError(ev: Event) {
      let ev2: any = ev;
      logger.logError(RtcPeerHelper.className, 'onSendChannelError', "error:", ev2.error);
   }

   private onSendChannelClose(ev: Event) {
      logger.logInfo(RtcPeerHelper.className, 'onSendChannelClose', "event:", ev);
   }

   // ICE handling
   //////////
   private onIceConnectionStateChange(ev: Event, pc: RTCPeerConnection) : void {
      var state = pc.iceConnectionState;
      logger.logInfo(RtcPeerHelper.className, 'onIceConnectionStateChange', "state:", state);

      if (state === "connected") {
         this._isIceConnected = true;
      }
      if (state === "failed") {
         this._isIceConnected = false;
         // TODO restartIce here
      }
   }

   private onIceCandidateError(ev: Event) : void {
      var ev2: any = ev;
      if (ev2.errorCode === 701) {
         logger.logError(RtcPeerHelper.className, 'onIceCandidateError', ev2.url + ' ', ev2.errorText);
      } else {
         logger.logInfo(RtcPeerHelper.className, 'onIceCandidateError', 'event:', ev);
      }
   }

   // Recieve channel handling
   //////////
   private onRecieveDataChannel(channel: RTCDataChannel) {
      logger.logInfo(RtcPeerHelper.className, 'onRecieveDataChannel', '', null);

      if (this._recieveChannel) {
         this._recieveChannel.close();
      }

      this._recieveChannel = channel;
      this._recieveChannel.onmessage = (ev) => { this.onRecieveChannelMessage(ev) };
      this._recieveChannel.onopen = (ev) => { this.onRecieveChannelOpen(ev, this._recieveChannel) };
      this._recieveChannel.onclose = this.onRecieveChannelClose.bind(this);
      this._recieveChannel.onerror = this.onRecieveChannelError.bind(this);
   }

   private onRecieveChannelOpen(ev: Event, dc: RTCDataChannel) : void {
      logger.logInfo(RtcPeerHelper.className, 'onRecieveChannelOpen', '', null);
   }

   private onRecieveChannelError(ev: Event): void {
      var ev2: any = ev;
      logger.logError(RtcPeerHelper.className, 'onRecieveChannelError', "error:", ev2.error);
   }

   private onRecieveChannelClose(ev: Event) : void {
      logger.logInfo(RtcPeerHelper.className, 'onRecieveChannelClose', '', null);
   }

   private onRecieveChannelMessage(ev: Event) {
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