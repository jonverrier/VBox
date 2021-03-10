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
import { LoggerFactory, ELoggerType } from './Logger';
import { IStreamable } from './Streamable';
import { ETransportType, CallParticipation } from './Call';
import { EPeerConnectionType, IPeerSignalSender, IPeerCaller, IPeerReciever, PeerNameCache, IPeerSignalReciever } from './PeerInterfaces';
import { PeerCallerRtc, PeerRecieverRtc } from './PeerRtc';
import { PeerCallerWeb, PeerRecieverWeb } from './PeerWeb';

var logger = new LoggerFactory().createLogger(ELoggerType.Client, true);

export class PeerFactory {
   constructor() {
   }

   createCallerConnection(connectionType: EPeerConnectionType,
      transport: ETransportType,
      localCallParticipation: CallParticipation,
      remoteCallParticipation: CallParticipation,
      person: Person,
      nameCache: PeerNameCache,
      signaller: IPeerSignalSender,
      signalReciever: IPeerSignalReciever): IPeerCaller {

      switch (transport) {
         case ETransportType.Rtc:
         default:
            return new PeerCallerRtc(localCallParticipation,
               remoteCallParticipation,
               person,
               nameCache,
               signaller);
         case ETransportType.Web:
            return new PeerCallerWeb(localCallParticipation,
               remoteCallParticipation,
               person,
               nameCache,
               signaller);
      }
   }

   createRecieverConnection(connectionType: EPeerConnectionType,
      transport: ETransportType,
      localCallParticipation: CallParticipation,
      remoteCallParticipation: CallParticipation,
      person: Person,
      nameCache: PeerNameCache,
      signaller: IPeerSignalSender,
      signalReciever: IPeerSignalReciever): IPeerReciever {

      switch (transport) {
         case ETransportType.Rtc:
         default:
            return new PeerRecieverRtc(localCallParticipation,
               remoteCallParticipation,
               person,
               nameCache,
               signaller);
         case ETransportType.Web:
            return new PeerRecieverWeb(localCallParticipation,
               remoteCallParticipation,
               person,
               nameCache,
               signaller);
      }
   }
}

