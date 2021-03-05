/*! Copyright TXPCo, 2020, 2021 */

import { LoggerFactory, ELoggerType } from './Logger';
import { Person } from './Person';
import { Facility } from './Facility';
import { TypeRegistry } from './Types';
import { DateWithDays } from './Dates'
import { Queue, QueueString, QueueNumber, QueueAny } from './Queue'
import { CallParticipation, CallOffer, CallAnswer, CallIceCandidate, CallLeaderResolve, CallKeepAlive } from './Call'
import { SignalMessage } from './Signal';
import { UserFacilities } from './UserFacilities';
import { Whiteboard, WhiteboardElement } from './Whiteboard';
import { EGymClockDuration, EGymClockMusic, EGymClockState, EGymClockAction, GymClockSpec, GymClockAction, GymClockState } from './GymClock'
import { EThreeStateSwitchEnum, EThreeStateRagEnum, EFourStateRagEnum} from './Enum';

var EntryPoints = {
   LoggerFactory: LoggerFactory,
   ELoggerType: ELoggerType,
   TypeRegistry: TypeRegistry,
   Person: Person,
   Facility: Facility,
   DateWithDays: DateWithDays,
   Queue: Queue,
   QueueString: QueueString,
   QueueNumber: QueueNumber,
   QueueAny: QueueAny,
   CallParticipation: CallParticipation,
   CallOffer: CallOffer,
   CallAnswer: CallAnswer,
   CallIceCandidate: CallIceCandidate,
   CallLeaderResolve: CallLeaderResolve,
   CallKeepAlive: CallKeepAlive,
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

export default EntryPoints;




