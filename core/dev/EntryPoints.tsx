/*! Copyright TXPCo, 2020, 2021 */

import { LoggerFactory, ELoggerType } from './Logger';
import { ArrayHook } from './ArrayHook';
import { Person } from './Person';
import { Facility } from './Facility';
import { StreamableTypes } from './StreamableTypes';
import { DateHook } from './DateHook'
import { Queue, QueueString, QueueNumber, QueueAny } from './Queue'
import { ETransportType, CallParticipation, CallOffer, CallAnswer, CallIceCandidate, CallLeaderResolve, CallKeepAlive, CallData, CallDataBatched } from './Call'
import { SignalMessage } from './Signal';
import { UserFacilities } from './UserFacilities';
import { Whiteboard, WhiteboardElement } from './Whiteboard';
import { EGymClockDuration, EGymClockMusic, EGymClockState, EGymClockAction, GymClockSpec, GymClockAction, GymClockState } from './GymClock'
import { EThreeStateSwitchEnum, EThreeStateRagEnum, EFourStateRagEnum } from './Enum';

// Peer-peer architecture
import { PeerLink } from './PeerLink';
import { EPeerConnectionType, IPeerSignalSender, IPeerCaller, IPeerReciever, PeerNameCache, IPeerSignalReciever } from './PeerInterfaces';
import { PeerCallerRtc, PeerRecieverRtc } from './PeerRtc';
import { PeerCallerWeb, PeerRecieverWeb } from './PeerWeb';
import { PeerFactory } from './PeerFactory';

// LiveDocument Architecture
import { LiveWorkout, LiveWhiteboardCommand } from './LiveWorkout';
import { LiveCommandProcessor } from './LiveCommand';
import { LiveDocumentChannelFactory } from './LiveChannel';

var EntryPoints = {
   LoggerFactory: LoggerFactory,
   ELoggerType: ELoggerType,
   StreamableTypes: StreamableTypes,
   Person: Person,
   Facility: Facility,
   Queue: Queue,
   QueueString: QueueString,
   QueueNumber: QueueNumber,
   QueueAny: QueueAny,
   ETransportType: ETransportType,
   CallParticipation: CallParticipation,
   CallOffer: CallOffer,
   CallAnswer: CallAnswer,
   CallIceCandidate: CallIceCandidate,
   CallLeaderResolve: CallLeaderResolve,
   CallKeepAlive: CallKeepAlive,
   CallData: CallData,
   CallDataBatched: CallDataBatched,
   SignalMessage: SignalMessage,
   UserFacilities: UserFacilities,
   Whiteboard: Whiteboard,
   WhiteboardElement: WhiteboardElement,
   EGymClockDuration: EGymClockDuration,
   EGymClockMusic: EGymClockMusic,
   EGymClockState: EGymClockState,
   EGymClockAction: EGymClockAction,
   GymClockSpec: GymClockSpec,
   GymClockAction: GymClockAction,
   GymClockState: GymClockState,
   EThreeStateSwitchEnum: EThreeStateSwitchEnum,
   EThreeStateRagEnum: EThreeStateRagEnum,
   EFourStateRagEnum: EFourStateRagEnum,

   // Peer Architecture
   PeerLink : PeerLink,
   EPeerConnectionType: EPeerConnectionType,
   PeerNameCache: PeerNameCache,
   PeerCallerRtc: PeerCallerRtc,
   PeerRecieverRtc: PeerRecieverRtc,
   PeerCallerWeb: PeerCallerWeb,
   PeerRecieverWeb: PeerRecieverWeb,
   PeerFactory: PeerFactory,

   // Live Document Architecture
   LiveWorkout: LiveWorkout,
   LiveWhiteboardCommand: LiveWhiteboardCommand,
   LiveCommandProcessor: LiveCommandProcessor,
   LiveDocumentChannelFactory: LiveDocumentChannelFactory
};

ArrayHook.initialise();
DateHook.initialise();

export default EntryPoints;




