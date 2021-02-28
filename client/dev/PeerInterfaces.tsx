/*! Copyright TXPCo, 2020, 2021 */
// Modules in the Peer architecture:
// PeerInterfaces - defines abstract interfaces for caller, reciever, signaller etc. 
// PeerRtc - contains concrete implementations of PeerCaller and PeerSender. 
// PeerSignaller - contains an implementation of the PeerSignaller interface. 

// This app, external components
import { CallOffer, CallAnswer, CallIceCandidate } from '../../core/dev/Call';
import { IStreamable } from '../../core/dev/Streamable'


export interface IPeer {

   handleIceCandidate(ice: CallIceCandidate): void;
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

export interface IPeerSignaller {

   sendOffer(offer: CallOffer): Promise<string> ;
   sendAnswer(answer: CallAnswer): Promise<string>;
   sendIceCandidate(iceCandidate: CallIceCandidate): Promise<string> ;
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