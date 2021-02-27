/*! Copyright TXPCo, 2020, 2021 */

// This app
import { CallOffer, CallAnswer, CallIceCandidate } from '../../core/dev/Call';


export interface IPeer {

   handleIceCandidate(ice: CallIceCandidate) : void;
}

export interface IPeerCaller extends IPeer  {

   placeCall(): void;

   handleAnswer(answer: CallAnswer): void;
}

export interface IPeerReciever extends IPeer {

   answerCall(remoteOffer: CallOffer) : void;
}

export interface IPeerSignaller {

   sendOffer(offer: CallOffer): void;
   sendAnswer(answer: CallAnswer): void;
   sendIceCandidate(iceCandidate: CallIceCandidate): void;
}