/*! Copyright TXPCo, 2020, 2021 */

// This app
import { Person } from '../../core/dev/Person';
import { Queue } from '../../core/dev/Queue';
import { LoggerFactory, LoggerType } from '../../core/dev/Logger';
import { TypeRegistry } from '../../core/dev/Types';
import { IStreamable } from '../../core/dev/Streamable';
import { CallParticipation, CallOffer, CallAnswer, CallIceCandidate } from '../../core/dev/Call';

var logger = new LoggerFactory().logger(LoggerType.Client);

// Helper class - take a name like 'Jon' and if the name is not unique for the session,
// tries variants like 'Jon:1', 'Jon:2' and so on until a unique one (for this session) is found.
// This is to distinguish the same person joining mutliple times (multiple devices or serial log ins such as browser refresh)
export class PeerNameCache {
   // member variables
   private nameMap: Map<string, boolean>;

   constructor() {
      this.nameMap = new Map<string, boolean>();
   }

   addReturnUnique(name: string): string {
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

export class RtcPeerHelper {
   // member variables
   private _localCallParticipation: CallParticipation;
   private _remoteCallParticipation: CallParticipation;
   private _localPerson: Person;
   private _remotePerson: Person;
   private _isChannelConnected: boolean;
   private _isIceConnected: boolean;
   private _nameCache: PeerNameCache;
   private static className: string = 'RtcPeerHelper';

   private _connection: RTCPeerConnection;
   private _iceQueue: Queue<any>;

   private _sendChannel: RTCDataChannel;
   private _recieveChannel: RTCDataChannel;
   private _sendQueue: Queue<IStreamable>;

   constructor(localCallParticipation: CallParticipation,
      remoteCallParticipation: CallParticipation,
      person: Person,
      nameCache: PeerNameCache
   ) {
      this._localCallParticipation = localCallParticipation;
      this._remoteCallParticipation = remoteCallParticipation;
      this._localPerson = person;
      this._nameCache = nameCache;
      this._isChannelConnected = false;
      this._sendChannel = null;
      this._recieveChannel = null;
      this._sendQueue = new Queue<IStreamable>();
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

   onConnectionStateChange(ev: Event, pc: RTCPeerConnection) : void {
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

   // Send channel handling
   //////////
   createSendChannel(connection: RTCPeerConnection, name: string): void {

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

   onSendChannelOpen(ev: Event, dc: RTCDataChannel) : void {

      this._isChannelConnected = true;

      try {
         // By convention, new joiners broadcast a 'Person' object to peers
         dc.send(JSON.stringify(this.localPerson));
      }
      catch (e) {
         logger.logError(RtcPeerHelper.className, 'onSendChannelOpen', "error:", e);
      }
   }

   onSendChannelMessage(msg) {
      logger.logInfo(RtcPeerHelper.className, 'onSendChannelMessage', "message:", msg.data);
   }

   onSendChannelError(ev: Event) {
      let ev2: any = ev;
      logger.logError(RtcPeerHelper.className, 'onSendChannelError', "error:", ev2.error);
   }

   onSendChannelClose(ev: Event) {
      logger.logInfo(RtcPeerHelper.className, 'onSendChannelClose', "event:", ev);
   }

   // ICE handling
   //////////
   onIceConnectionStateChange(ev: Event, pc: RTCPeerConnection) {
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

   onIceCandidateError(ev: Event) : void {
      var ev2: any = ev;
      if (ev2.errorCode === 701) {
         logger.logError(RtcPeerHelper.className, 'onIceCandidateError', ev2.url + ' ', ev2.errorText);
      } else {
         logger.logInfo(RtcPeerHelper.className, 'onIceCandidateError', 'event:', ev);
      }
   }

   // Recieve channel handling
   //////////
   onRecieveDataChannel(channel: RTCDataChannel) {
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

   onRecieveChannelOpen(ev: Event, dc: RTCDataChannel) : void {
      logger.logInfo(RtcPeerHelper.className, 'onRecieveChannelOpen', '', null);
   }

   onRecieveChannelError(ev: Event): void {
      var ev2: any = ev;
      logger.logError(RtcPeerHelper.className, 'onRecieveChannelError', "error:", ev2.error);
   }

   onRecieveChannelClose(ev: Event) : void {
      logger.logInfo(RtcPeerHelper.className, 'onRecieveChannelClose', '', null);
   }

   onRecieveChannelMessage(ev: Event) {
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