/*! Copyright TXPCo, 2020, 2021 */
// Modules in the Peer architecture:
// PeerConnection : overall orchestration & interface to the UI.
// PeerFactory - creates Rtc or Web versions as necessary to meet a request for a PeerCaller or PeerSender. 
// PeerInterfaces - defines abstract interfaces for PeerCaller, PeerSender, PeerSignalsender, PeerSignalReciever etc 
// PeerLink - contains a connection, plus logic to bridge the send/receieve differences, and depends only on abstract classes. 
// PeerRtc - contains concrete implementations of PeerCaller and PeerSender, send and recieve data via WebRTC
// PeerSignaller - contains an implementation of the PeerSignalSender & PeerSignalReciever interfaces.
// PeerWeb  - contains concrete implementations of PeerCaller and PeerSender, sends and recoeved data via the node.js server

// This app, external components
import { Person } from '../../core/dev/Person';
import { CallOffer, CallAnswer, CallIceCandidate, CallParticipation, CallData } from '../../core/dev/Call';
import { IStreamable } from '../../core/dev/Streamable'

export enum EPeerConnectionType {
   Caller,
   Reciever
}

export interface IPeer {
   /**
   * set of 'getters' & some 'setters' for private variables
   */
   localCallParticipation(): CallParticipation;
   remoteCallParticipation(): CallParticipation;
   localPerson(): Person;
   remotePerson(): Person;
   isConnected(): boolean;
   send(data: IStreamable): void;

   handleIceCandidate(ice: CallIceCandidate): void;
   handleRemoteData(data: CallData);
   onRemoteData(data: IStreamable): void;
   onRemoteFail(): void;
   close(): void;
}

export interface IPeerCaller extends IPeer  {

   placeCall(): void;

   handleAnswer(answer: CallAnswer): void;
}

export interface IPeerReciever extends IPeer {

   answerCall(remoteOffer: CallOffer) : void;
}

export interface IPeerSignalSender {

   sendOffer(offer: CallOffer): Promise<string> ;
   sendAnswer(answer: CallAnswer): Promise<string>;
   sendIceCandidate(iceCandidate: CallIceCandidate): Promise<string>;
   sendData(callData: IStreamable): Promise<string>;
}

export interface IPeerSignalReciever {
   connect(participation: CallParticipation): void;
   onRemoteData(data: IStreamable): void;
   isConnected(): boolean;
}

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