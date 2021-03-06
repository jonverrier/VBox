/*! Copyright TXPCo, 2020, 2021 */
// Modules in the Peer architecture:
// PeerConnection : overall orchestration & interface to the UI.
// PeerInterfaces - defines abstract interfaces for PeerCaller, PeerSender, PeerSignalsender, PeerSignalReciever etc 
// PeerLink - contains a connection, plus logic to bridge the send/receieve differences, and depends only on abstract classes. 
// PeerRtc - contains concrete implementations of PeerCaller and PeerSender. 
// PeerSignaller - contains an implementation of the PeerSignalSender & PeerSignalReciever interfaces.

// External components
import axios from 'axios';

// This app, other components 
import { LoggerFactory, ELoggerType } from '../../core/dev/Logger';
import { CallParticipation, CallOffer, CallAnswer, CallIceCandidate } from '../../core/dev/Call';
import { IStreamable } from '../../core/dev/Streamable';
import { TypeRegistry } from '../../core/dev/Types';

// This app, this component
import { IPeerSignalSender, IPeerSignalReciever } from './PeerInterfaces';

var logger = new LoggerFactory().createLogger(ELoggerType.Client, true);

export class SignalSender implements IPeerSignalSender {
   // member variables
   private static className: string = 'SignalSender';

   constructor() {
   }

   sendOffer(offer: CallOffer): Promise<string>  {
      return new Promise((resolve, reject) => {
         axios.post('/api/offer', { params: { callOffer: offer } })
            .then((response) => {
               logger.logInfo(SignalSender.className, 'sendOffer', "Post Ok", null);
               resolve('');
            })
            .catch(function (error) {
               logger.logError(SignalSender.className, 'sendOffer', 'error:', error);
               reject(error.toString());
            });
      });
   }

   sendAnswer(answer: CallAnswer): Promise<string> {
      return new Promise((resolve, reject) => {
         axios.post('/api/answer', { params: { callAnswer: answer } })
            .then((response) => {
               logger.logInfo(SignalSender.className, 'sendAnswer', "Post Ok", null);
               resolve('');
            })
            .catch(function (error) {
               logger.logError(SignalSender.className, 'sendAnswer', 'error:', error);
               reject(error.toString());
            });
      });
   }

   sendIceCandidate(iceCandidate: CallIceCandidate): Promise<string>  {
      return new Promise((resolve, reject) => {
         axios.post('/api/icecandidate', { params: { callIceCandidate: iceCandidate } })
            .then((response) => {
               logger.logInfo(SignalSender.className, 'sendIceCandidate', "Post Ok: candidate:", iceCandidate.ice);
               resolve('');
            })
            .catch(function (error) {
               logger.logError(SignalSender.className, 'sendIceCandidate', 'error:', error);
               reject(error.toString());
            });
      });
   }

   sendData(callData: IStreamable): Promise<string> {
      return new Promise((resolve, reject) => {
         axios.post('/api/peerdata', { params: { callData: callData } })
            .then((response) => {
               logger.logInfo(SignalSender.className, 'sendData', "Post Ok", null);
               resolve('');
            })
            .catch(function (error) {
               logger.logError(SignalSender.className, 'sendData', 'error:', error);
               reject(error.toString());
            });
      });
   }
}

export class SignalReciever implements IPeerSignalReciever {
   // member variables
   private _events: EventSource;
   private _lastSequenceNo: number;
   private _retries: number;
   private _participation: CallParticipation;
   private _types: TypeRegistry;

   private static className: string = 'SignalReciever';

   constructor() {
      this._lastSequenceNo = 0;
      this._retries = 0;
      this._types = new TypeRegistry();

      // These two get set later on 
      this._participation = undefined;
      this._events = undefined;
   }

   connect(participation: CallParticipation) {
      this._participation = participation;     
      this.reConnect(participation);
   }

   isConnected(): boolean {
      return (this._events != null) && (this._retries === 0);
   }

   // Override this for data from notifications 
   onRemoteData: ((this: IPeerSignalReciever, ev: IStreamable) => any) | null;

   onServerData(ev: Event): void {

      this._retries = 0;

      let ev2: any = ev;
      var remoteCallData = this._types.reviveFromJSON(ev2.data);
      var payload = remoteCallData.data;

      if (this.onRemoteData)
         this.onRemoteData(payload);

      this._lastSequenceNo = remoteCallData.sequenceNo;
   }

   onServerError(ev: Event): void {

      logger.logInfo(SignalReciever.className, 'onServerError', "event, retries:", { ev: ev, retries: this._retries });
      this._events.close();
      this.connectLater(3000);
      this._retries++;
   }

   onServerOpen(ev: Event): void {

      logger.logInfo(SignalReciever.className, 'onServerOpen', "event:", ev);
   }

   private reConnect(participation: CallParticipation): void {

      if (this._events) {
         this._events.close();
      }

      // Send our own details & subscribe to more
      const sourceUrl = '/callevents/?callParticipation='
         + encodeURIComponent(JSON.stringify(this._participation))
         + '&sequenceNo=' + encodeURIComponent(JSON.stringify(this._lastSequenceNo));
      this._events = new EventSource(sourceUrl);
      this._events.onmessage = this.onServerData.bind (this);
      this._events.onerror = this.onServerError.bind(this);
      this._events.onopen = this.onServerOpen.bind(this);
   }

   private sleep(time) {
      return new Promise(resolve => setTimeout(resolve, time));
   }

   private async connectLater(time) {
      await this.sleep(time);
      this.reConnect(this._participation);
   }}
