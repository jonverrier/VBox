/*! Copyright TXPCo, 2020, 2021 */

import axios from 'axios';

// This app
import { LoggerFactory, LoggerType } from '../../core/dev/Logger';
import { TypeRegistry } from '../../core/dev/Types';
import { IStreamable } from '../../core/dev/Streamable';
import { CallParticipation, CallOffer, CallAnswer, CallIceCandidate } from '../../core/dev/Call';
import { IPeerSignaller } from './PeerInterfaces';

var logger = new LoggerFactory().logger(LoggerType.Client);

// Helper class - take a name like 'Jon' and if the name is not unique for the session,
export class Signaller implements IPeerSignaller {
   // member variables
   private static className: string = 'Signaller';

   constructor() {
   }

   sendOffer(offer: CallOffer): void {
      axios.post('/api/offer', { params: { callOffer: offer } })
         .then((response) => {
            logger.logInfo(Signaller.className, 'sendOffer', "Post Ok", null);
         })
         .catch(function(error) {
            logger.logError(Signaller.className, 'sendOffer', 'error:', error);
         });
   }

   sendAnswer(answer: CallAnswer): void {

   }

   sendIceCandidate(iceCandidate: CallIceCandidate): void {
      axios.post('/api/icecandidate', { params: { callIceCandidate: iceCandidate } })
         .then((response) => {
            logger.logInfo(Signaller.className, 'sendIceCandidate', 'Post Ok', null);
         })
         .catch((e) => {
            logger.logError(Signaller.className, 'sendIceCandidate', 'Post error:', e);
         });
   }
}

