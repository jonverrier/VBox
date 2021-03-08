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
import { EThreeStateSwitchEnum, EThreeStateRagEnum, EFourStateRagEnum} from './Enum';

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
   EFourStateRagEnum: EFourStateRagEnum
};

ArrayHook.initialise();
DateHook.initialise();

export default EntryPoints;




