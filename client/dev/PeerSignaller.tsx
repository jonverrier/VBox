/*! Copyright TXPCo, 2020, 2021 */
// PeerInterfaces - defines abstract interfaces for caller, reciever, signaller etc. 
// PeerRtc - contains concrete implementations of PeerCaller and PeerSender. 
// PeerSignaller - contains an implementation of the PeerSignaller interface.

// External components
import axios from 'axios';

// This app, this component
import { LoggerFactory, LoggerType } from '../../core/dev/Logger';
import { CallOffer, CallAnswer, CallIceCandidate } from '../../core/dev/Call';
import { IPeerSignaller } from './PeerInterfaces';

var logger = new LoggerFactory().logger(LoggerType.Client, true);

// Helper class - take a name like 'Jon' and if the name is not unique for the session,
export class Signaller implements IPeerSignaller {
   // member variables
   private static className: string = 'Signaller';

   constructor() {
   }

   sendOffer(offer: CallOffer): Promise<string>  {
      return new Promise((resolve, reject) => {
         axios.post('/api/offer', { params: { callOffer: offer } })
            .then((response) => {
               logger.logInfo(Signaller.className, 'sendOffer', "Post Ok", null);
               resolve('');
            })
            .catch(function (error) {
               logger.logError(Signaller.className, 'sendOffer', 'error:', error);
               reject(error.toString());
            });
      });
   }

   sendAnswer(answer: CallAnswer): Promise<string> {
      return new Promise((resolve, reject) => {
         axios.post('/api/answer', { params: { callAnswer: answer } })
            .then((response) => {
               logger.logInfo(Signaller.className, 'sendAnswer', "Post Ok", null);
               resolve('');
            })
            .catch(function (error) {
               logger.logError(Signaller.className, 'sendAnswer', 'error:', error);
               reject(error.toString());
            });
      });
   }

   sendIceCandidate(iceCandidate: CallIceCandidate): Promise<string>  {
      return new Promise((resolve, reject) => {
         axios.post('/api/icecandidate', { params: { callIceCandidate: iceCandidate } })
            .then((response) => {
               logger.logInfo(Signaller.className, 'sendIceCandidate', "Post Ok: candidate:", iceCandidate.ice);
               resolve('');
            })
            .catch(function (error) {
               logger.logError(Signaller.className, 'sendIceCandidate', 'error:', error);
               reject(error.toString());
            });
      });
   }
}

