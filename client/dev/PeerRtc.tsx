/*! Copyright TXPCo, 2020, 2021 */
// PeerInterfaces - defines abstract interfaces for caller, reciever, signaller etc. 
// PeerRtc - contains concrete implementations of PeerCaller and PeerSender. 
// PeerSignaller - contains an implementation of the PeerSignaller interface. 

// RTC References:
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling
// https://medium.com/xamarin-webrtc/webrtc-signaling-server-dc6e38aaefba 
// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation

// External libraries
import axios from 'axios';

// This app
import { Person } from '../../core/dev/Person';
import { Queue } from '../../core/dev/Queue';
import { LoggerFactory, LoggerType } from '../../core/dev/Logger';
import { TypeRegistry } from '../../core/dev/Types';
import { IStreamable } from '../../core/dev/Streamable';
import { CallParticipation, CallOffer, CallAnswer, CallIceCandidate } from '../../core/dev/Call';
import { IPeerSignaller, IPeerCaller, IPeerReciever, PeerNameCache } from './PeerInterfaces'

var logger = new LoggerFactory().logger(LoggerType.Client);

export class PeerCallerRtc implements IPeerCaller {
   // member variables
   peerHelp: RtcPeerHelper;

   constructor(localCallParticipation: CallParticipation,
      remoteCallParticipation: CallParticipation,
      person: Person,
      nameCache: PeerNameCache,
      signaller: IPeerSignaller) {

      this.peerHelp = new RtcPeerHelper(localCallParticipation,
         remoteCallParticipation,
         person, nameCache, signaller);

      // Hook to pass any data up the chain
      this.peerHelp.onRemoteData = this.onRemoteDataInner.bind(this);
   }

   // Override this for data for notifications 
   onRemoteData: ((this: PeerCallerRtc, ev: IStreamable) => any) | null;

   placeCall(): void {

      this.peerHelp.createConnection(RtcConnectionType.Caller, "Celler");
   }

   handleAnswer(answer: CallAnswer): void {
      this.peerHelp.handleAnswer(answer);
   }

   handleIceCandidate(ice: CallIceCandidate): void {
      this.peerHelp.handleIceCandidate(ice);
   }

   send(obj: IStreamable): void {
      this.peerHelp.send(obj);
   }

   private onRemoteDataInner(ev: IStreamable): void {

      if (this.onRemoteData) {
         this.onRemoteData(ev);
      }
   }
}

export class PeerRecieverRtc implements IPeerReciever {
   // member variables
   peerHelp: RtcPeerHelper;

   constructor(localCallParticipation: CallParticipation,
      remoteCallParticipation: CallParticipation,
      person: Person,
      nameCache: PeerNameCache,
      signaller: IPeerSignaller) {

      this.peerHelp = new RtcPeerHelper(localCallParticipation,
         remoteCallParticipation,
         person, nameCache,
         signaller);

      // Hook to pass any data up the chain
      this.peerHelp.onRemoteData = this.onRemoteDataInner.bind(this);
   }

   // Override this for data for notifications 
   onRemoteData: ((this: PeerRecieverRtc, ev: IStreamable) => any) | null;

   answerCall(offer: CallOffer): void {

      this.peerHelp.createConnection(RtcConnectionType.Reciever, "Reciever");

      this.peerHelp.answerCall(offer);
   }

   handleIceCandidate(ice: CallIceCandidate): void {
      this.peerHelp.handleIceCandidate(ice);
   }

   send(obj: IStreamable): void {
      this.peerHelp.send(obj);
   }

   private onRemoteDataInner(ev: IStreamable): void {

      if (this.onRemoteData) {
         this.onRemoteData(ev);
      }
   }
}

enum RtcConnectionType {
   Caller,
   Reciever
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
   private _signaller: IPeerSignaller;
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
      signaller: IPeerSignaller
   ) {
      this._localCallParticipation = localCallParticipation;
      this._remoteCallParticipation = remoteCallParticipation;
      this._localPerson = person;
      this._nameCache = nameCache;
      this._signaller = signaller;

      this._isChannelConnected = false;
      this._sendChannel = null;
      this._recieveChannel = null;
      this._sendQueue = new Queue<IStreamable>();
      this._connection = null;
      this._iceQueue = new Queue<CallIceCandidate>();
   }

   // Override these for notifications - TODO - see top of file
   onRemoteData: ((this: RtcPeerHelper, ev: Event) => any) | null;

   /**
   * set of 'getters' & some 'stters' for private variables
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
   createConnection(type: RtcConnectionType, channelName: string) : void {
      // TODO - factory for config:
      // - STUN only
      // - TURN only
      // - All
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

      this._connection = new RTCPeerConnection(configuration);
      this._connection.onicecandidate = (ice) => {
         this.onIceCandidate(ice.candidate, this.remoteCallParticipation);
      };

      if (type === RtcConnectionType.Caller) {
         this._connection.onnegotiationneeded = (ev) => { this.onNegotiationNeededCaller(ev); };
      } else {
         this._connection.onnegotiationneeded = (ev) => { this.onNegotiationNeededReciever(ev); };
      }

      this._connection.ondatachannel = (ev) => { this.onRecieveDataChannel(ev.channel) };
      this._connection.oniceconnectionstatechange = (ev) => { this.onIceConnectionStateChange(ev, this._connection); };
      this._connection.onconnectionstatechange = (ev) => { this.onConnectionStateChange(ev, this._connection); };
      this._connection.onicecandidateerror = (ev) => { this.onIceCandidateError(ev); };

      this.createSendChannel(this._connection, channelName);
   }

   private onIceCandidate(candidate, to: CallParticipation) : void {

      var self = this;

      // Send our call ICE candidate in
      var callIceCandidate = new CallIceCandidate(null, this.localCallParticipation, to, candidate, true);
      this._signaller.sendIceCandidate(callIceCandidate);
   }

   private onNegotiationNeededCaller (ev: Event) : void {

      logger.logInfo(RtcPeerHelper.className, 'onNegotiationNeededCaller', 'Event:', ev);

      // ICE enumeration does not start until we create a local description, so call createOffer() to kick this off
      this._connection.createOffer({ iceRestart: true })
         .then(offer => this._connection.setLocalDescription(offer))
         .then(() => {
            // Send our call offer data in
            logger.logInfo(RtcPeerHelper.className, 'onNegotiationNeededCaller', 'Posting offer', null);
            var callOffer = new CallOffer(null, this.localCallParticipation, this.remoteCallParticipation, this._connection.localDescription);
            this._signaller.sendOffer(callOffer);
         })
   };

   private onNegotiationNeededReciever (ev: Event) {
      var self = this;

      logger.logInfo(RtcPeerHelper.className, 'onNegotiationNeededReciever', 'Event:', ev);
   };

   private onConnectionStateChange(ev: Event, pc: RTCPeerConnection) : void {
      switch (pc.connectionState) {
         case "connected":
            break;
         case "disconnected":
            break;
         case "failed":
            // The connection has been closed or failed
            this._isChannelConnected = false;
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
            var callAnswer = new CallAnswer(null, self.localCallParticipation, remoteOffer.from, self._connection.localDescription);
            this._signaller.sendAnswer(callAnswer)
               .then((response) => {
                  // Dequeue any iceCandidates that were enqueued while we had not set remoteDescription
                  while (!self._iceQueue.isEmpty()) {
                     self.handleIceCandidate.bind(self)(self._iceQueue.dequeue())
                  }
               })
         });
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
   private onIceConnectionStateChange(ev: Event, pc: RTCPeerConnection) {
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

      var types = new TypeRegistry();
      var remoteCallData = types.reviveFromJSON(ev2.data);

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
      }

      if (this.onRemoteData) {
         this.onRemoteData(remoteCallData);
      }
   }
}